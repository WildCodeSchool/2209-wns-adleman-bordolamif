import { ApolloError } from 'apollo-server-errors';
import Service from '../entity/Service';
import ServiceModel from '../models/ServiceModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { ServiceInput } from '../utils/types/InputTypes';

const ServiceController = {

  getAllServices: async (): Promise<Service[]> => await ServiceModel.getAllServices(),

  getOneServiceById: async (id: number): Promise<Service> => {
    const service = await ServiceModel.getOneServiceById(id);
    if (service === null) throw new ApolloError('Service not found', 'NOT_FOUND');
    return service;
  },

  createService: async (data: ServiceInput): Promise<Service> => {
    let waitingRoom;
    if (data.waitingRoom) {
      waitingRoom = await WaitingRoomModel.getOneWaitingRoomById(data.waitingRoom?.id);
      if (waitingRoom === null) throw new ApolloError('WaitingRoom not found', 'NOT_FOUND');
    } else waitingRoom = undefined;
    const {
      name, acronym, open, color,
    } = data;
    const serviceToCreate = {
      name, acronym, open, color, waitingRoom,
    };
    return await ServiceModel.createService(serviceToCreate);
  },

  deleteService: async (id: number): Promise<boolean> => {
    const { affected } = await ServiceModel.deleteService(id);
    if (affected === 0) throw new ApolloError('Service not found', 'NOT_FOUND');
    return true;
  },

  updateService: async (data: ServiceInput, id: number): Promise<Service> => {
    const {
      name, acronym, open, color, waitingRoom,
    } = data;
    const ServiceToUpdate = await ServiceModel.getOneServiceById(id);

    if (ServiceToUpdate === null) { throw new ApolloError('Service not found', 'NOT_FOUND'); }

    ServiceToUpdate.name = name;
    ServiceToUpdate.acronym = acronym;
    ServiceToUpdate.open = open;
    ServiceToUpdate.color = color;

    if (waitingRoom !== null && typeof (waitingRoom) !== 'undefined') {
      ServiceToUpdate.waitingRoom = await
      WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom!.id) || null;
    } else {
      ServiceToUpdate.waitingRoom = undefined;
    }

    return await ServiceModel.updateService(ServiceToUpdate);
  },
};

export default ServiceController;
