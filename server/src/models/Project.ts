import mongoose, { Model, Schema, Types} from "mongoose";

interface IProject {
  readonly userId: Types.ObjectId,
  name: string,
  description?: string,
  createdAt: number
}

interface IProjectMethods {}

interface ProjectModel extends Model<IProject, {}, IProjectMethods> {}

const projectSchema = new Schema<IProject, ProjectModel, IProjectMethods>(
  {
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String}
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IProject, ProjectModel>('Project', projectSchema);