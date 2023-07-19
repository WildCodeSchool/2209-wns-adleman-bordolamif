import User from '../entity/User';
import express from 'express';
import jwt from 'jsonwebtoken';
import { FindOperator } from 'typeorm';
import { ServiceId } from './types/InputIdTypes';
import { StatusEnum } from './enums/StatusEnum';
import { DailyStatistics } from './types/StatisticsType';

export interface ContextType {
  req: express.Request;
  res: express.Response;
  currentUser?: User;
  jwtPayload?: jwt.JwtPayload;
}

interface CreatedAtFilter {
  createdAt: FindOperator<Date>;
}
export interface SearchFilter {
  where?: CreatedAtFilter;
}

export interface SearchCriterias {
  service: ServiceId[];
  status: FindOperator<StatusEnum>;
  createdAt: FindOperator<Date> | undefined;
}

export interface StatisticsDetail {
  service: string;
  number: number;
  mobileRate: number;
  waitingTimeAverage: number;
  returnedRate: number;
  firstTimeRate: number;
}

export interface WeeklyStatistics {
  week: string;
  total: number;
  detail: StatisticsDetail[];
}

export interface MonthlyStatistics {
  month: string;
  total: number;
  detail: StatisticsDetail[];
}

export interface FullStatistics {
  daily : DailyStatistics[];
  weekly : WeeklyStatistics[];
  monthly: MonthlyStatistics[];
}

export interface StatsDatasDetail{
  service: string,
  number: number,
  mobileCount: number,
  waitingTimeList: number[],
  suspendingCount: number,
  firstTimeCount:number,
}

export interface StatsDatas {
    total : number,
    detail: StatsDatasDetail[]
  }
export interface DailyStatsDatas extends StatsDatas{
    date : string
  }
