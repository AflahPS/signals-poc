import { model, ObjectId, Schema } from 'mongoose';
import toJSON from '../utils/toJSON/toJSON';
import paginate from '../utils/paginate/paginate';
import { IStationDoc, IStationModel } from './station.interfaces';

const stationSchema = new Schema<IStationDoc, IStationModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stationSchema.plugin(toJSON);
stationSchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The station's name
 * @param {ObjectId} [excludeStationId] - The id of the station to be excluded
 * @returns {Promise<boolean>}
 */
stationSchema.static('isNameTaken', async function (name: string, excludeStationId: ObjectId): Promise<boolean> {
  const station = await this.findOne({ name, _id: { $ne: excludeStationId } });
  return !!station;
});

const Station = model<IStationDoc, IStationModel>('Station', stationSchema);

export default Station;
