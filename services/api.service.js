import axios from "axios";
import { getKeyValue, TOKEN_DICTIONATY } from "./storage.service.js";
import https from "https";
import chalk from "chalk";
import dedent from "dedent-js";

const getWeatherByHttps = async (city) => {
  const token = await getKeyValue(TOKEN_DICTIONATY.token);
  if (!token) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }

  const url = new URL("https://api.weatherapi.com/v1/current.json");
  url.searchParams.append("q", city);
  url.searchParams.append("key", token);
  url.searchParams.append("lang", "ru");

  https.get(url, (response) => {
    let result = {};
    response.on("data", (chunk) => {
      result = JSON.parse(chunk);
    });

    response.on("end", () => {
      console.log(result);
    });
  });
};

const getWeatherByAxios = async () => {
  const token = await getKeyValue(TOKEN_DICTIONATY.token);
  const city = await getKeyValue(TOKEN_DICTIONATY.city);

  if (!token || !token.length) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }
  if (!city || !city.length) {
    throw new Error("Город не задан, задайте его через команду -s [CITY]");
  }

  const { data } = await axios("https://api.weatherapi.com/v1/current.json", {
    params: {
      q: city,
      lang: "ru",
      key: token,
    },
  });

  const printWeather = () => {
    console.log(
      dedent(
        `Погода в городе ${chalk.bgWhite(data.location.name)} (${
          data.location.country
        }): 
        ${chalk.yellow(data.current.condition.text)}
        Температура ${data.current.temp_c} градусов`
      )
    );
  };
  printWeather();

  return data;
};
export { getWeatherByHttps, getWeatherByAxios };
