const AppError = require('../error/appError');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: "Name or price can't be empty" });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'name,price,-ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {
  //   // const newTour = new Tour({})
  //   // newTour.save()

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    data: { tours: tours },
  });
  //   try {
  //   console.log(req.query);
  //   //BUILD QUERY
  //   // 1A) Filtering
  //   // const queryObj = { ...req.query };
  //   // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  //   // excludeFields.forEach((el) => delete queryObj[el]);

  //   // // 1B) ADVANCED FILTERING
  //   // let queryStr = JSON.stringify(queryObj);
  //   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //   // let query = Tour.find(JSON.parse(queryStr));

  //   // 2) SORTING
  //   // if (req.query.sort) {
  //   //   const sortBy = req.query.sort.split(',').join(' ');
  //   //   query = query.sort(sortBy);
  //   //   // sort('price ratingsAverage'); // Sorting by price and ratingsAverage
  //   // } else {
  //   //   query = query.sort('createdAt');
  //   // }

  //   //3) Field limiting(We can specify the fields we want to return from a query)
  //   // if (req.query.fields) {
  //   //   const fields = req.query.fields.split(',').join(' ');
  //   //   query = query.select(fields);
  //   // } else {
  //   //   query = query.select('-__v');
  //   // }

  //   // 4) PAGINATION
  //   // const page = req.query.page * 1 || 1;
  //   // const limit = req.query.limit * 1 || 100;
  //   // const skip = (page - 1) * limit;
  //   // query = query.skip(skip).limit(limit);

  //   // if (req.query.page) {
  //   //   const numberOfTours = await Tour.countDocuments();
  //   //   if (skip >= numberOfTours) throw new Error('Page does not exist');
  //   // }
  //   // EXECUTE QUERY

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No Tour found with the ${req.params.id} ID`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: { tour: tour },
  });

  //   try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(
      new AppError(`No Tour found with the ${req.params.id} ID`, 404)
    );
  }
  res.status(200).json({ status: 'success', data: { tour: tour } });

  //   try {
  //   } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(
      new AppError(`No Tour found with the ${req.params.id} ID`, 404)
    );
  }
  res.status(204).json({ status: 'success', data: null });

  //   try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAvegrage: { $gte: 4.5 } }, //ratingsAvegrage
    },
    {
      $group: {
        // _id: '$price',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numOfRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAvegrage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({ status: 'success', data: { stats } });
  //   try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({ status: 'success', data: { plan } });

  //   try {
  //   } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
