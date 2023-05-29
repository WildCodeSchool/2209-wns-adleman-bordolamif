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
    const date: string = ticketsList[i].createdAt!.toDateString();
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
      createStatsDatasDetail(ticketsList[i], newDay.detail, waitingTime);
      statsDatas.push(newDay);
    } else {
      // Sinon j'ajoute mon ticket au total des tickets du jour
      statsDatas[dateAlreadyTreatedIndex].total += 1;
      // recherche si ce jour là, des données on déjà été rentrées pour le service
      const serviceAlreadyTreatedIndex = statsDatas[dateAlreadyTreatedIndex].detail
        .findIndex((item) => item.service === ticketsList[i].service.name);
      if (serviceAlreadyTreatedIndex === -1) {
        // Si aucune donnée n'a été traité pour ce service à cette date, créer l'entrée
        createStatsDatasDetail(
          ticketsList[i],
          statsDatas[dateAlreadyTreatedIndex].detail,
          waitingTime,
        );
      } else {
        // Sinon j'ajoute les valeurs de mon ticket aux données brutes de la journée par service
        addToStatsDatasDetail(
          ticketsList[i],
          statsDatas[dateAlreadyTreatedIndex].detail[serviceAlreadyTreatedIndex],
          waitingTime,
        );
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
      const newDetail = convertDetailDataToStats(serviceDetail);
      dailyStats.detail.push(newDetail);
    });
    stats.push(dailyStats);
  });
  // tri par ordre chronologique
  stats.sort((a, b) => a.date.localeCompare(b.date));
  return stats;
};

const createStatsDatasDetail = (
  ticket: Ticket,
  detailArray:StatsDatasDetail[],
  waitingTime: number | null,
) => {
  const newServiceDetail: StatsDatasDetail = {
    service: ticket.service.name,
    number: 1,
    mobileCount: ticket.mobileToken ? 1 : 0,
    waitingTimeList: waitingTime! ? [waitingTime] : [],
    suspendingCount: ticket.isReturned ? 1 : 0,
    firstTimeCount: ticket.isFirstTime ? 1 : 0,
  };

  detailArray.push(newServiceDetail);
};

const addToStatsDatasDetail = (
  ticket: Ticket,
  detail:StatsDatasDetail,
  waitingTime: number | null,
) => {
  detail.number += 1;

  if (ticket.mobileToken) {
    detail.mobileCount += 1;
  }
  if (waitingTime!) {
    detail.waitingTimeList.push(waitingTime);
  }
  if (ticket.isReturned) {
    detail.suspendingCount += 1;
  }
  if (ticket.isFirstTime) {
    detail.firstTimeCount += 1;
  }
};

const convertDetailDataToStats = (serviceDetail:StatsDatasDetail) => {
  const totalWaitingTime = serviceDetail.waitingTimeList.reduce((a, b) => a + b);
  const newDetail: StatisticsDetail = {
    service: serviceDetail.service,
    number: serviceDetail.number,
    mobileRate: serviceDetail.mobileCount / serviceDetail.number,
    waitingTimeAverage: totalWaitingTime / serviceDetail.waitingTimeList.length,
    returnedRate: serviceDetail.suspendingCount / serviceDetail.number,
    firstTimeRate: serviceDetail.firstTimeCount / serviceDetail.number,
  };
  return newDetail;
};
