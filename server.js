require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));

app.set('view-engine', 'ejs');

const visitorSchema = new mongoose.Schema(
  {
    visitorIp: {
      type: String,
      required: true,
    },
    numberOfVisits: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

app.get('/', async (req, res) => {
  try {
    const allVisitors = await Visitor.find({});
    // console.log('allVisitors:', allVisitors);

    const currentVisitor = await Visitor.findOne({ visitorIp: req.ip });
    // console.log("currentVisitor", currentVisitor);

    if (!currentVisitor) {
      await Visitor.create({
        visitorIp: req.ip,
        numberOfVisits: 1,
      });
    }

    if (currentVisitor) {
      await Visitor.findOneAndUpdate(
        { visitorIp: req.ip },
        { numberOfVisits: currentVisitor.numberOfVisits + 1 },
        { new: true }
      );
    }

    const totalUniqueVisitors = await Visitor.countDocuments({});
    // console.log('totalUniqueVisitors', totalUniqueVisitors);

    const totalVisitsAggregated = await Visitor.aggregate([
      {
        $group: {
          _id: '',
          numberOfVisits: { $sum: '$numberOfVisits' },
        },
      },
    ]);
    const totalVisits = totalVisitsAggregated[0].numberOfVisits;
    // console.log('totalVisits', totalVisits);

    res.render('index.ejs', {
      allVisitors: allVisitors,
      currentVisitor: currentVisitor,
      totalUniqueVisitors: totalUniqueVisitors,
      totalVisits: totalVisits,
    });
  } catch (error) {
    res.json(error);
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to the Database and listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
