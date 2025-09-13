import Log from "../models/Log.model.js";
import Vehicle from "../models/Vehicle.model.js";
import ExcelJS from "exceljs";
import nodemailer from "nodemailer";

/* 🔹 Build Excel workbook */
async function buildExcel(logs, vehicleName = "All Vehicles") {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Fuel Report");

  // Title
  sheet.mergeCells("A1:J1");
  const title = sheet.getCell("A1");
  title.value = `Fuel Report — ${vehicleName}`;
  title.font = { size: 16, bold: true };
  title.alignment = { horizontal: "center" };

  // Header
  const headers = [
    "Date",
    "Vehicle",
    "Amount (₹)",
    "Price / L",
    "Litres",
    "Trip Distance (km)",
    "Mileage (km/L)",
    "Running Cost (₹/km)",
    "Odometer (km)",
    "Notes",
  ];
  sheet.addRow(headers);
  sheet.getRow(2).font = { bold: true };
  sheet.getRow(2).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Rows
  logs.forEach((log) => {
    sheet.addRow([
      log.date ? new Date(log.date).toLocaleDateString() : "",
      log.vehicle?.name || log.vehicle,
      log.amount ?? "",
      log.pricePerL ?? "",
      log.litres ?? "",
      log.tripDistance ?? "",
      log.mileage ?? "",
      log.runningCostPerKm ?? "",
      log.odometer ?? "",
      log.notes ?? "",
    ]);
  });

  sheet.columns.forEach((col) => {
    let max = 15;
    col.eachCell({ includeEmpty: true }, (cell) => {
      max = Math.max(max, String(cell.value ?? "").length + 2);
    });
    col.width = max;
  });

  return workbook;
}

/* 🔹 Export Excel */
export const generateExcelReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    let logs;
    let vehicleName = "All Vehicles";

    if (vehicleId && vehicleId !== "all") {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        userId: req.user.id,
      });
      if (!vehicle) {
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });
      }
      logs = await Log.find({ vehicle: vehicleId, userId: req.user.id }).sort({
        date: -1,
      });
      vehicleName = vehicle.name;
    } else {
      logs = await Log.find({ userId: req.user.id }).populate("vehicle");
    }

    const workbook = await buildExcel(logs, vehicleName);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fuel-report-${vehicleName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("generateExcelReport error:", err);
    res
      .status(500)
      .json({ success: false, message: "Report generation failed" });
  }
};

/* 🔹 Send Email */
export const sendReportByEmail = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { to } = req.body;

    if (!to) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient email required" });
    }

    let logs;
    let vehicleName = "All Vehicles";

    if (vehicleId && vehicleId !== "all") {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        userId: req.user.id,
      });
      if (!vehicle) {
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });
      }
      logs = await Log.find({ vehicle: vehicleId, userId: req.user.id }).sort({
        date: -1,
      });
      vehicleName = vehicle.name;
    } else {
      logs = await Log.find({ userId: req.user.id }).populate("vehicle");
    }

    const workbook = await buildExcel(logs, vehicleName);
    const buffer = await workbook.xlsx.writeBuffer();

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
      subject: `Fuel Report — ${vehicleName}`,
      text: "Attached is your requested fuel report.",
      attachments: [
        {
          filename: `fuel-report-${vehicleName}.xlsx`,
          content: buffer,
        },
      ],
    });

    res
      .status(200)
      .json({ success: true, message: "Report sent successfully via email" });
  } catch (err) {
    console.error("sendReportByEmail error:", err);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};
