import Log from "../models/Log.model.js";
import Papa from "papaparse";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

// Generate CSV report
export const generateCSVReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const logs = await Log.find({ vehicle: vehicleId, userId: req.user.id });

    const csv = Papa.unparse(
      logs.map((log) => ({
        date: log.date,
        amount: log.amount,
        pricePerL: log.pricePerL,
        litres: log.litres,
        tripDistance: log.tripDistance,
        mileage: log.mileage,
        runningCostPerKm: log.runningCostPerKm,
      }))
    );

    res.header("Content-Type", "text/csv");
    res.attachment(`vehicle_${vehicleId}_report.csv`);
    res.send(csv);
  } catch (err) {
    console.error("generateCSVReport error:", err);
    res.status(500).json({ success: false, message: "Report generation failed" });
  }
};

// Generate PDF report
export const generatePDFReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const logs = await Log.find({ vehicle: vehicleId, userId: req.user.id });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=vehicle_${vehicleId}_report.pdf`
    );

    doc.text(`Fuel Report for Vehicle: ${vehicleId}`, { underline: true });
    doc.moveDown();

    logs.forEach((log, idx) => {
      doc.text(
        `${idx + 1}. Date: ${log.date.toDateString()}, Amount: ${log.amount}, Litres: ${log.litres}, Mileage: ${log.mileage}`
      );
    });

    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error("generatePDFReport error:", err);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
};

// Send report by email
export const sendReportByEmail = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: "Recipient email required" });
    }

    const logs = await Log.find({ vehicle: vehicleId, userId: req.user.id });

    // Generate PDF in memory
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: `Fuel Report Vehicle ${vehicleId}`,
        text: "Please find attached your fuel report.",
        attachments: [{ filename: `vehicle_${vehicleId}_report.pdf`, content: pdfData }],
      });

      res.status(200).json({ success: true, message: "Email sent successfully" });
    });

    doc.text(`Fuel Report for Vehicle: ${vehicleId}`, { underline: true });
    logs.forEach((log, idx) => {
      doc.text(
        `${idx + 1}. Date: ${log.date.toDateString()}, Amount: ${log.amount}, Litres: ${log.litres}, Mileage: ${log.mileage}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("sendReportByEmail error:", err);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};
