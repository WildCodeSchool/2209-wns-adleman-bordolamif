/* eslint-disable no-unreachable-loop */
import Ticket from '../../entity/Ticket';
import {
  DailyStatsDatas, StatisticsDetail, StatsDatasDetail,
} from '../interfaces';
import { DailyStatistics } from '../types/StatisticsType';

export const getDailyStatistics = (ticketsList: Ticket[]): DailyStatistics[] => {
  // Récupération des données brutes ----------------------------------------------------
  const statsDatas: DailyStatsDatas[] = [];
  // Pour chaque ticket de la liste
  for (let i = 0; i < ticketsList.length; i += 1) {
    // Définition de la date
    const date: string = ticketsList[i].createdAt!.toDateString().substring(0, 10);
    // Définition du temps d'attente
    let waitingTime: number | null = null;
    if (ticketsList[i].closedAt!) {
      waitingTime = ticketsList[i].closedAt!.getTime() - ticketsList[i].createdAt!.getTime();
    }
    // Recherche si la date est déjà resensée
    const dateAlreadyTreatedIndex: number = statsDatas.findIndex(
      (item) => item.date.includes(date),
    );
    // Si aucune donéee traitée ne correspond à cette date, créer une nouvelle entrée
    if (dateAlreadyTreatedIndex === -1) {
      const newDay: DailyStatsDatas = { date, total: 1, detail: [] };
      const newServiceDetail: StatsDatasDetail = {
        service: ticketsList[i].service.name,
        number: 1,
        mobileCount: ticketsList[i].mobileToken ? 1 : 0,
        waitingTimeList: waitingTime! ? [waitingTime] : [],
        suspendingCount: ticketsList[i].isReturned ? 1 : 0,
        firstTimeCount: ticketsList[i].isFirstTime ? 1 : 0,
      };

      newDay.detail.push(newServiceDetail);
      statsDatas.push(newDay);
    } else {
      // Sinon j'ajoute mon ticket au total des tickets du jour
      statsDatas[dateAlreadyTreatedIndex].total += 1;
      // recherche si ce jour là, des données on déjà été rentrées pour le service
      const serviceAlreadyTreatedIndex = statsDatas[dateAlreadyTreatedIndex].detail
        .findIndex((item) => item.service === ticketsList[i].service.name);
      if (serviceAlreadyTreatedIndex === -1) {
        // Si aucune donnée n'a été traité pour ce service à cette date, créer l'entrée
        const newServiceDetail: StatsDatasDetail = {
          service: ticketsList[i].service.name,
          number: 1,
          mobileCount: ticketsList[i].mobileToken ? 1 : 0,
          waitingTimeList: waitingTime! ? [waitingTime] : [],
          suspendingCount: ticketsList[i].isReturned ? 1 : 0,
          firstTimeCount: ticketsList[i].isFirstTime ? 1 : 0,
        };
        statsDatas[dateAlreadyTreatedIndex].detail.push(newServiceDetail);
      } else {
        // Sinon j'ajoute les valeurs de mon ticket aux données brutes de la journée par service
        statsDatas[dateAlreadyTreatedIndex]
          .detail[serviceAlreadyTreatedIndex]
          .number += 1;
        if (ticketsList[i].mobileToken) {
          statsDatas[dateAlreadyTreatedIndex]
            .detail[serviceAlreadyTreatedIndex]
            .mobileCount += 1;
        }
        if (waitingTime!) {
          statsDatas[dateAlreadyTreatedIndex]
            .detail[serviceAlreadyTreatedIndex]
            .waitingTimeList.push(waitingTime);
        }
        if (ticketsList[i].isReturned) {
          statsDatas[dateAlreadyTreatedIndex]
            .detail[serviceAlreadyTreatedIndex]
            .suspendingCount += 1;
        }
        if (ticketsList[i].isFirstTime) {
          statsDatas[dateAlreadyTreatedIndex]
            .detail[serviceAlreadyTreatedIndex]
            .firstTimeCount += 1;
        }
      }
    }
  }
  // une fois les données brutes obtenues, les transformer en statistiques -----------------------
  const stats: DailyStatistics[] = [];
  statsDatas.forEach((dailyData) => {
    const dailyStats: DailyStatistics = {
      date: dailyData.date,
      total: dailyData.total,
      detail: [],
    };
    dailyData.detail.forEach((serviceDetail) => {
      const totalWaitingTime = serviceDetail.waitingTimeList.reduce((a, b) => a + b);
      const newDetail: StatisticsDetail = {
        service: serviceDetail.service,
        number: serviceDetail.number,
        mobileRate: serviceDetail.mobileCount / serviceDetail.number,
        waitingTimeAverage: totalWaitingTime / serviceDetail.waitingTimeList.length,
        returnedRate: serviceDetail.suspendingCount / serviceDetail.number,
        firstTimeRate: serviceDetail.firstTimeCount / serviceDetail.number,
      };
      dailyStats.detail.push(newDetail);
    });
    stats.push(dailyStats);
  });
  // tri par ordre chronologique
  stats.sort((a, b) => a.date.localeCompare(b.date));
  return stats;
};
