#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getWeatherByAxios } from "./services/api.service.js";
import { printError, printSuccess, printHelp } from "./services/log.service.js";
import {
  saveKeyValue,
  getKeyValue,
  TOKEN_DICTIONATY,
} from "./services/storage.service.js";

const saveToken = async (token) => {
  if (!token.length) {
    printError("Токен не передан");
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONATY.token, token);
    printSuccess("Токен сохранен");
  } catch (error) {
    printError(error.message);
  }
};

const saveCity = (city) => {
  if (!city.length) {
    printError("Введите город");
    return;
  }

  saveKeyValue(TOKEN_DICTIONATY.city, city);
  printSuccess("Город сохранен");
};

const getForcast = async () => {
  try {
    await getWeatherByAxios();
  } catch (error) {
    if (error?.response?.status === 400) {
      printError("Город введен неверно");
      return;
    }
    if (error?.response?.status === 403) {
      printError("Токен введен неверно");
      return;
    }
    printError(error.message);
  }
};
const initCLI = () => {
  const args = getArgs(process.argv);

  //get help
  if (args.h) {
    printHelp();
    return;
  }

  //save city
  if (args.s) {
    saveCity(args.s);
    return;
  }

  //save token
  if (args.t) {
    saveToken(args.t);
    return;
  }
  getForcast();
};

initCLI();
