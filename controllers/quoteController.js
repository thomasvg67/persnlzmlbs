const Quote = require('../models/Quote');

exports.getAllQuotes = async (req, res) => {
  try {
    const { page = 1, category = '', search = '' } = req.query;
    const PAGE_SIZE = 25;
    const skip = (page - 1) * PAGE_SIZE;

    const query = {
      dltSts: false,
    };

    if (category) query.subCategory = category;
    if (search && search.length >= 3) {
      query.$or = [
        { writtenBy: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
        { quote: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Quote.countDocuments(query);
    const quotes = await Quote.find(query)
      .sort({ crtdOn: -1 })
      .skip(skip)
      .limit(PAGE_SIZE);

    res.json({ quotes, totalPages: Math.ceil(total / PAGE_SIZE), currentPage: +page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch quotes' });
  }
};

exports.addQuote = async (req, res) => {
  try {
    const userId = req.user?.uId || 'system';
    const ip = req.ip;

    const newQuote = new Quote({
      subCategory: req.body.subCategory,
      writtenBy: req.body.writtenBy,
      source: req.body.source || '',
      quote: req.body.quote || '',
      sts: req.body.sts ?? true,
      crtdBy: userId,
      crtdIp: ip,
    });

    await newQuote.save();
    res.json({ message: 'Quote added successfully', quote: newQuote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add quote' });
  }
};

exports.editQuote = async (req, res) => {
  try {
    const userId = req.user?.uId || 'system';
    const ip = req.ip;

    const updated = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          subCategory: req.body.subCategory,
          writtenBy: req.body.writtenBy,
          source: req.body.source,
          quote: req.body.quote,
          sts: req.body.sts,
          updtBy: userId,
          updtIp: ip,
          updtOn: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Quote not found' });

    res.json({ message: 'Quote updated successfully', quote: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const userId = req.user?.uId || 'system';
    const ip = req.ip;

    const deleted = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          dltSts: true,
          dltBy: userId,
          dltIp: ip,
          dltOn: new Date(),
        },
      },
      { new: true }
    );

    if (!deleted) return res.status(404).json({ message: 'Quote not found' });

    res.json({ message: 'Quote soft-deleted successfully', quote: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed' });
  }
};
