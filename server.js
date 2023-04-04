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

    if (!currentVisitor) {
      await Visitor.create({
        visitorIp: visitorIpFromRequest,
        numberOfVisits: 1,
      });
    }

    if (currentVisitor) {
      await Visitor.findOneAndUpdate(
        { visitorIp: visitorIpFromRequest },
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

    // const totalVisits = totalVisitsAggregated[0].numberOfVisits;
    // console.log('totalVisits', totalVisits);

    const allVisitors = await Visitor.find({});
    // console.log('allVisitors:', allVisitors);

    Promise.all([currentVisitor, totalUniqueVisitors, totalVisitsAggregated, allVisitors]).then(
      (values) => {
        // res.json(values);
        res.render('index.ejs', {
          currentVisitor: values[0],
          totalUniqueVisitors: values[1],
          totalVisits: values[2][0].numberOfVisits,
          allVisitors: values[3],
        });
      }
    );
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
