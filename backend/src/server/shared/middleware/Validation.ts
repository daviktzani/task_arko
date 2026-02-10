/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Schema, ValidationError } from "yup";

type TProperty = 'body' | 'header' | 'params' | 'query';

type TGetSchema = <T>(schema: Schema<T>) => Schema<T>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TGetAllSchemas>;

type TAllSchemas = Record<TProperty, Schema<unknown>>;

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => { 
    const schemas = getAllSchemas(schema => schema);
    console.log(schemas);

    const errorsResult: Record<string, Record<string, string>> = {}; 
    (Object.entries(schemas) as [TProperty, Schema<unknown>][]).forEach(([key, schema]) => {
        try {
                schema.validateSync(req[key as TProperty], { abortEarly: false}); 
                
                
            } catch (err) {
                const yupError = err as ValidationError;
                const validationErrors: Record<string,string> = {};
        
                yupError.inner.forEach(error => {
                    if(error.path === undefined) return;
                    
                    validationErrors[error.path] = error.message;
                });

                errorsResult[key] = validationErrors;
            }
    });

    if (Object.entries(errorsResult).length === 0) {
        return next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult});

    }
};