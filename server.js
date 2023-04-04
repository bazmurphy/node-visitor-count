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
    const visitorIpFromRequest = req.ip.slice(7);

    const currentVisitor = await Visitor.findOne({ visitorIp: visitorIpFromRequest });
    // console.log('currentVisitor', currentVisitor);

    let existingVisitor;
    let newVisitor;

    if (currentVisitor) {
      existingVisitor = await Visitor.findOneAndUpdate(
        { visitorIp: visitorIpFromRequest },
        { numberOfVisits: currentVisitor.numberOfVisits + 1 },
        { new: true }
      );
    } else {
      newVisitor = await Visitor.create({
        visitorIp: visitorIpFromRequest,
        numberOfVisits: 1,
      });
    }
    // console.log('existingVisitor', existingVisitor);
    // console.log('newVisitor', newVisitor);

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

    // const totalVisits = totalVisitsAggregated[0].numberOfVisits;
    // console.log('totalVisits', totalVisits);

    const allVisitors = await Visitor.find({});
    // console.log('allVisitors:', allVisitors);

    Promise.all([
      currentVisitor,
      existingVisitor,
      newVisitor,
      totalUniqueVisitors,
      totalVisitsAggregated,
      allVisitors,
    ]).then((values) => {
      // console.log(values);
      res.render('index.ejs', {
        currentVisitor: values[0] ? values[1] : values[2],
        totalUniqueVisitors: values[3],
        totalVisits: values[4][0].numberOfVisits,
        allVisitors: values[5],
      });
    });
  } catch (error) {
    res.send('Error');
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
