import User from '../entity/User';
import express from 'express';
import jwt from 'jsonwebtoken';

export interface ContextType {
    req: express.Request;
    res: express.Response;
    currentUser?: User;
    jwtPayload?: jwt.JwtPayload;
  }
