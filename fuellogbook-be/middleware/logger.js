function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
}

export const logger=(req,res,next)=>{
     const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const now = new Date();
    const formattedDate = formatDate(now);
    const log = `[${formattedDate}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
    if (res.statusCode >= 400) {
      console.log(`Error: ${res.statusMessage || 'Unknown error.'}`);
    }
  });
  next();
}