import { Parser as Json2CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { SleepLog } from '../models/SleepLog.js';

// Export sleep logs to CSV
export async function exportCsv(req, res, next) {
  try {
    const logs = await SleepLog.find({ userId: req.user._id }).sort({ sleepStart: -1 }).lean();
    const fields = ['sleepStart', 'sleepEnd', 'mood', 'caffeine', 'disturbances', 'notes'];
    const parser = new Json2CsvParser({ fields });
    const csv = parser.parse(
      logs.map((l) => ({
        sleepStart: new Date(l.sleepStart).toISOString(),
        sleepEnd: new Date(l.sleepEnd).toISOString(),
        mood: l.mood,
        caffeine: l.caffeine,
        disturbances: l.disturbances,
        notes: (l.notes || '').replace(/\n/g, ' '),
      }))
    );
    res.header('Content-Type', 'text/csv');
    res.attachment('sleep_logs.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

// Export a simple PDF summary of last 7 days
export async function exportPdf(req, res, next) {
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
    const logs = await SleepLog.find({ userId: req.user._id, sleepStart: { $gte: from, $lte: to } })
      .sort({ sleepStart: -1 })
      .lean();

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sleep_summary.pdf"');
    doc.pipe(res);

    doc.fontSize(18).text('Sleep Summary (Last 7 Days)', { underline: true });
    doc.moveDown();

    logs.forEach((l) => {
      doc
        .fontSize(12)
        .text(`Start: ${new Date(l.sleepStart).toLocaleString()}  End: ${new Date(l.sleepEnd).toLocaleString()}`)
        .text(`Mood: ${l.mood}  Caffeine: ${l.caffeine}mg  Disturbances: ${l.disturbances}`)
        .text(`Notes: ${l.notes || '-'}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    next(err);
  }
}


