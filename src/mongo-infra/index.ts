import mongoose from 'mongoose';

export * from './repo';

export const initMongo = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await mongoose.connect(process.env.MONOGO_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test',
    useFindAndModify: false,
  });
};
