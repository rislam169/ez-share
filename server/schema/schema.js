//Mongose Models
const Project = require("../models/Project");
const Client = require("../models/Client");
const File = require("../models/File");
const Request = require("../models/Request");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLScalarType,
} = require("graphql");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

//File Type
const FileType = new GraphQLObjectType({
  name: "File",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    content: { type: GraphQLString },
    type: { type: GraphQLString },
    size: { type: GraphQLString },
    status: { type: GraphQLString },
    createdAt: { type: dateScalar },
    updatedAt: { type: dateScalar },
  }),
});

//Request Type
const RequestType = new GraphQLObjectType({
  name: "Request",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    type: { type: GraphQLString },
    file: {
      type: FileType,
      resolve(parent, arg) {
        return File.findById(parent.fileId);
      },
    },
    createdAt: { type: dateScalar },
    updatedAt: { type: dateScalar },
  }),
});

//Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, arg) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryTpe",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    requests: {
      type: new GraphQLList(RequestType),
      args: { status: { type: GraphQLString } },
      resolve(parent, args) {
        return Request.find({ status: { $in: args.status } });
      },
    },
    request: {
      type: RequestType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Request.findById(args.id);
      },
    },
    files: {
      type: new GraphQLList(FileType),
      resolve(parent, args) {
        return File.find();
      },
    },
    file: {
      type: FileType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return File.findById(args.id);
      },
    },
  },
});

//Mutations
const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    //Add a client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();
      },
    },
    //Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return Client.findByIdAndRemove(args.id);
      },
    },

    //Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },

    //Delete a projects
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },

    //Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
        clientId: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
              clientId: args.clientId,
            },
          },
          { new: true }
        );
      },
    },

    //Add a file
    addFile: {
      type: FileType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        size: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "FileStatus",
            values: {
              unblocked: { value: "Unblocked" },
              blocked: { value: "Blocked" },
            },
          }),
          defaultValue: "Unblocked",
        },
      },
      resolve(parent, args) {
        const file = new File({
          name: args.name,
          size: args.size,
          data: args.data,
          type: args.type,
          uploadedAt: args.uploadedAt,
          status: args.status,
        });

        return file.save();
      },
    },

    //Add a request
    addRequest: {
      type: RequestType,
      args: {
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "RequestStatus",
            values: {
              pending: { value: "Pending" },
              processing: { value: "Processing" },
              accepted: { value: "Accepted" },
              rejected: { value: "Rejected" },
            },
          }),
          defaultValue: "Pending",
        },
        type: {
          type: new GraphQLEnumType({
            name: "RequestType",
            values: {
              block: { value: "Block" },
              unblock: { value: "Unblock" },
            },
          }),
        },
        fileId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const request = new Request({
          description: args.description,
          type: args.type,
          fileId: args.fileId,
        });

        return request.save();
      },
    },

    //Reject a request
    rejectRequest: {
      type: RequestType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Request.findByIdAndUpdate(args.id, {
          $set: {
            status: "Rejected",
          },
        });
      },
    },

    //Reject a request
    acceptRequest: {
      type: RequestType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Request.findByIdAndUpdate(args.id, {
          $set: {
            status: "Accepted",
          },
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
