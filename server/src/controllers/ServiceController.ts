import Service from '../entity/Service';
import ServiceModel from '../models/ServiceModel';
import WaitingRoomModel from '../models/WaitingRoomModel';
import { ServiceInput } from '../utils/types/InputTypes';

const ServiceController = {

  getAllServices: async (): Promise<Service[]> => await ServiceModel.getAllServices(),

  getOneServiceById: async (id: number): Promise<Service> => {
    const service = await ServiceModel.getOneServiceById(id);
    if (service === null) throw new Error('Service not found');
    return service;
  },

  createService: async (data: ServiceInput): Promise<Service> => {
    let waitingRoom;
    if (data.waitingRoom) {
      waitingRoom = await WaitingRoomModel.getOneWaitingRoomById(data.waitingRoom?.id);
      if (waitingRoom === null) throw new Error('WaitingRoom not found');
    } else waitingRoom = undefined;
    const {
      name, acronym, isOpen, color,
    } = data;
    const serviceToCreate = {
      name, acronym, isOpen, color, waitingRoom,
    };
    return await ServiceModel.createService(serviceToCreate);
  },

  deleteService: async (id: number): Promise<boolean> => {
    const { affected } = await ServiceModel.deleteService(id);
    if (affected === 0) throw new Error('Service not found');
    return true;
  },

  updateService: async (data: ServiceInput, id: number): Promise<Service> => {
    const {
      name, acronym, isOpen, color, waitingRoom,
    } = data;
    const ServiceToUpdate = await ServiceModel.getOneServiceById(id);

    if (ServiceToUpdate === null) { throw new Error('Service not found'); }

    ServiceToUpdate.name = name;
    ServiceToUpdate.acronym = acronym;
    ServiceToUpdate.isOpen = isOpen;
    ServiceToUpdate.color = color;

    if (waitingRoom !== null && typeof (waitingRoom) !== 'undefined') {
      ServiceToUpdate.waitingRoom = await
      WaitingRoomModel.getOneArgWaitingRoom(data.waitingRoom!.id) || null;
    } else {
      ServiceToUpdate.waitingRoom = undefined;
    }

    return await ServiceModel.updateService(ServiceToUpdate);
  },

  updateServicesIsOpenByCurrentUsers: async (
    previousServiceId:number | null,
    currentServiceId?:number | null,
  ) => {
    if (previousServiceId) {
      const previousService = await ServiceModel.getOneServiceById(previousServiceId);
      if (previousService === null) throw new Error('Previous service not found');
      if (typeof previousService?.currentUsers === 'undefined' || previousService?.currentUsers!.length === 0) {
        previousService.isOpen = false;
        await ServiceModel.updateService(previousService);
      }
    }
    if (currentServiceId) {
      const currentService = await ServiceModel.getOneServiceById(currentServiceId);
      if (currentService === null) throw new Error('Current service not found');

      if (typeof currentService?.currentUsers !== 'undefined' && currentService?.currentUsers!.length > 0) {
        currentService.isOpen = true;
        await ServiceModel.updateService(currentService);
      }
    }
  },
};

export default ServiceController;
