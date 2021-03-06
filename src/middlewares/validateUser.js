import { check, body } from 'express-validator';
import handleErrors from './baseMiddleware';

export const validateUser = [
  check('firstname')
    .matches(/^[a-zA-Z]+$/i)
    .withMessage('firstname must contain only alphabets')
    .isLength({
      min: 2,
    })
    .withMessage('field cannot be empty')
    .isLength({
      max: 50,
    })
    .withMessage('firstname cannot have more than 50 characters')
    .matches(/^\S{3,}$/)
    .withMessage('firstname cannot contain whitespaces')
    .trim(),

  check('lastname')
    .matches(/^[a-zA-Z]+$/i)
    .withMessage('lastname must contain only alphabets')
    .isLength({
      min: 2,
    })
    .withMessage('field cannot be empty')
    .isLength({
      max: 50,
    })
    .withMessage('lastname cannot have more than 50 characters')
    .matches(/^\S{3,}$/)
    .withMessage('lastname cannot contain whitespaces')
    .trim(),

  check('email').isEmail().withMessage('Please input a valid email address'),

  check('password')
    .isLength({
      min: 5,
    })
    .withMessage('password must have atleast 5 characters')
    .isLength({
      max: 50,
    })
    .withMessage('maximum number of characters reached')
    .trim(),

  body('confirmPassword').custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),

  (req, res, next) => handleErrors(req, res, next),
];

export const validateLogin = [
  check('email').isEmail().withMessage('Please input a valid email address'),

  check('password')
    .isLength({
      min: 1,
    })
    .withMessage('Please input a password'),
  (req, res, next) => handleErrors(req, res, next),
];
