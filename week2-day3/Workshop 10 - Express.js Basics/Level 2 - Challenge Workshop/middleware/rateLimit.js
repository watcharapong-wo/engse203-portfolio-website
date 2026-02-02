// middleware/rateLimit.js

const rateLimit = () => {
  // ใช้ Map เก็บ request count
  const requests = new Map();

  return (req, res, next) => {
    // TODO: ดึง IP address จาก request
    // TODO: ตรวจสอบจำนวน requests ใน time window
    // TODO: ถ้าเกิน limit ให้ส่ง 429 Too Many Requests
    // TODO: ถ้าไม่เกิน ให้บันทึกและเรียก next()
    
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000; // 15 min
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    const requestData = requests.get(ip);
    
    if (now - requestData.startTime > windowMs) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    requestData.count++;
    
    if (requestData.count > maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil((requestData.startTime + windowMs - now) / 1000)
      });
    }

    next();
  };
};

module.exports = rateLimit;
