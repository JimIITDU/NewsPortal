const { ReporterApplication, User } = require('../models');

// Reader submits application
exports.apply = async (req, res) => {
  try {
    const existing = await ReporterApplication.findOne({
      where: { userId: req.user.id, status: 'pending' }
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending application.' });
    }
    const { bio, experience, portfolioUrl, topics } = req.body;
    if (!bio || !experience || !topics) {
      return res.status(400).json({ message: 'Bio, experience and topics are required.' });
    }
    const application = await ReporterApplication.create({
      userId: req.user.id, bio, experience,
      portfolioUrl: portfolioUrl || null, topics
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Reader checks their own application status
exports.getMyApplication = async (req, res) => {
  try {
    const application = await ReporterApplication.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Admin gets all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await ReporterApplication.findAll({
      include: [{ model: User, as: 'applicant', attributes: ['id', 'name', 'email', 'role'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Admin reviews application
exports.review = async (req, res) => {
  try {
    const application = await ReporterApplication.findByPk(req.params.id, {
      include: [{ model: User, as: 'applicant' }]
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }

    await application.update({
      status,
      adminNote: adminNote || null,
      reviewedBy: req.user.id
    });

    // If approved promote user to reporter
    if (status === 'approved') {
      await application.applicant.update({ role: 'reporter' });
    }

    res.json({ message: `Application ${status}.`, application });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};