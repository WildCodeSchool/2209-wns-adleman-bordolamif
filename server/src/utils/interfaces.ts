import User from '../entity/User';
import express from 'express';
import jwt from 'jsonwebtoken';
import { FindOperator } from 'typeorm';
import { ServiceId } from './types/InputIdTypes';
import { StatusEnum } from './enums/StatusEnum';

export interface ContextType {
    req: express.Request;
    res: express.Response;
    currentUser?: User;
    jwtPayload?: jwt.JwtPayload;
  }

  interface CreatedAtFilter {
    createdAt : FindOperator<Date>
   }
export interface SearchFilter {
     where?: CreatedAtFilter;
   }

export interface SearchCriterias{
    service: ServiceId[],
    status: FindOperator<StatusEnum>,
    createdAt: FindOperator<Date> | undefined
   }
