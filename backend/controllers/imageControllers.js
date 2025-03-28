const sql = require('mssql');
const imageProcessing = require('../services/imageProcessing');
const csvExport = require('../services/csvExport');

class ImageController {
  async uploadImage(req, res) {
    try {
      const { userId, imagePath } = req.body;

      // Kiểm tra chất lượng ảnh
      const qualityCheck = imageProcessing.checkImageQuality(imagePath);
      if (!qualityCheck.valid) {
        return res.status(400).json({ message: 'Invalid image quality' });
      }

      // Kiểm tra ảnh trùng
      const isDuplicate = await imageProcessing.checkDuplicateImage(imagePath);
      if (isDuplicate) {
        return res.status(409).json({ message: 'Duplicate image' });
      }

      // Lưu ảnh vào database
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
      request.input('imagePath', sql.NVarChar, imagePath);
      request.input('createAt', sql.DateTime, new Date());

      const result = await request.query(`
        INSERT INTO Face_data (user_id, image_path, create_at) 
        VALUES (@userId, @imagePath, @createAt);
        SELECT SCOPE_IDENTITY() AS id;
      `);

      // Gán nhãn ảnh
      const label = imageProcessing.labelImage(imagePath);

      res.status(201).json({ 
        message: 'Image uploaded successfully',
        imageId: result.recordset[0].id,
        label: label
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Image upload failed', 
        error: error.message 
      });
    }
  }

  async searchImages(req, res) {
    try {
      const { startDate, endDate, cameraLocation } = req.query;

      const request = new sql.Request();
      let query = `
        SELECT f.*, u.UserName 
        FROM Face_data f
        LEFT JOIN Users u ON f.user_id = u.UserID
        WHERE 1=1
      `;

      if (startDate) {
        query += ` AND f.create_at >= @startDate`;
        request.input('startDate', sql.DateTime, new Date(startDate));
      }

      if (endDate) {
        query += ` AND f.create_at <= @endDate`;
        request.input('endDate', sql.DateTime, new Date(endDate));
      }

      const result = await request.query(query);
      res.json(result.recordset);

    } catch (error) {
      res.status(500).json({ 
        message: 'Image search failed', 
        error: error.message 
      });
    }
  }

  async exportImagesToCsv(req, res) {
    try {
      const images = req.body.images;
      const csvData = await csvExport.generateCsv(images);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=images.csv');
      res.send(csvData);

    } catch (error) {
      res.status(500).json({ 
        message: 'CSV export failed', 
        error: error.message 
      });
    }
  }
}

module.exports = new ImageController();