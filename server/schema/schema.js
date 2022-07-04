//Mongose Models
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

const RootQuery = new GraphQLObjectType({
  name: "RootQueryTpe",
  fields: {
    requests: {
      type: new GraphQLList(RequestType),
      args: { status: { type: GraphQLString } },
      resolve(parent, args) {
        console.log(args.status);
        return args.status
          ? Request.find({ status: { $in: args.status } })
          : Request.find();
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
          status: "Pending",
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
