import mongoose, { Model, Schema, Types} from "mongoose";

interface ITask {
  readonly userId: Types.ObjectId,
  projectId?: Types.ObjectId,
  name: string,
  description?: string,
  done: boolean,
  priority: number,
  createdAt: number,
  dueDate: number
}

interface ITaskMethods {}

interface TaskModel extends Model<ITask, {}, ITaskMethods> {}

const taskSchema = new Schema<ITask, TaskModel, ITaskMethods> (
  {
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    projectId: {type: Schema.Types.ObjectId, ref: 'Project'},
    name: {type: String, required: true},
    description: {type: String},
    done: {type: Boolean, required: true, default: false},
    priority: {type: Number, required: true, default: 1},
    dueDate: {type: Schema.Types.Date, reqired: true}
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ITask, TaskModel>('Task', taskSchema);