'use strict';

const log4js = require('log4js');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');
const pm = require('./utils/processManager.js');
const express = require('express');
const penteModule = require('./penteModule/penteModule.js');
const conversion = require ('./conversion/Convert_Lambert_Modul.js');

// const apiStructure = require('apiStructure.js')

var LOGGER;


/**
*
* @function
* @name start
* @description Fonction principale
*
*/

function start() {

  console.log("===========================");
  console.log("Service web");
  console.log("===========================");

  // Chargement de la configuration
  // Notamment pour pouvoir charger le logger
  let configuration = loadGlobalConfiguration();

  // Instanciation du logger et sauvegarde de sa configuration
  let logConfiguration = getLoggerConfiguration(configuration);
  initLogger(logConfiguration);

  // const api = apiStructure();


  const app = express();

  app.get('/', function (req, res) {
    let x = req.query.x;
    let y = req.query.y;
    let pente = penteModule.computeSlope(x,y);
    let orient = penteModule.computeAspect(x,y);
    res.json({
      "pente":pente,
      "orientation":orient
    });
  });
  app.get('/conversion', function (req, res) {
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    let result = conversion.Lambert_to_pm(latitude,longitude);

    res.json(result);
      
  
  });
  app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });



}

/**
*
* @function
* @name loadGlobalConfiguration
* @description Charger la configuration globale du serveur
* @return {json} Configuration global du serveur
*
*/

function loadGlobalConfiguration() {

  console.log("Lecture de la configuration...");

  let file;
  let globalConfiguration;

  // on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
  nconf.argv().env(['TEMPLATE_CONF_FILE','TEMPLATE_HOST','TEMPLATE_PORT']);
  // Cette ligne est utile si on n'utilise pas nconf.file
  // sans l'usage de nconf.use ou nconf.file, nconf.set ne marche pas.
  nconf.use('memory');

  if (nconf.get('TEMPLATE_CONF_FILE')) {

    // chemin absolu du fichier
    file = path.resolve(__dirname,nconf.get('TEMPLATE_CONF_FILE'));

    // vérification de l'exitence du fichier
    if (fs.existsSync(file)) {
      // chargement dans une variable pour la classe Service
      globalConfiguration = JSON.parse(fs.readFileSync(file));
    } else {
      console.log("Mauvaise configuration: fichier de configuration global inexistant: " + file);
      console.log("Utilisez le paramètre TEMPLATE_CONF_FILE en ligne de commande ou en variable d'environnement pour le préciser.");
      process.exit(1);
    }

  } else {
    //si aucun fichier n'a été précisé on prend, par défaut, le fichier du projet
    file = path.resolve(__dirname,'../config/template.json');
    console.log("Fichier de configuration: " + file);
    globalConfiguration = JSON.parse(fs.readFileSync(file));
    nconf.set('TEMPLATE_CONF_FILE',file);
  }

  console.log("Configuration chargee.")

  return globalConfiguration;

}

/**
*
* @function
* @name initLogger
* @description Initialiser le logger
* @param {json} userLogConfigurationFile - Configuration des logs de l'application
*
*/

function initLogger(userLogConfiguration) {

  console.log("Instanciation du logger...");

  if (userLogConfiguration) {

    if (userLogConfiguration.mainConf) {

      // Configuration du logger
      log4js.configure(userLogConfiguration.mainConf);

      //Instanciation du logger
      LOGGER = log4js.getLogger('SERVER');

      LOGGER.info("Logger charge.");

    } else {
      console.log("Mauvaise configuration pour les logs: 'mainConf' absent.");
      process.exit(1);
    }

  } else {
    console.log("Aucune configuration pour les logs.");
    process.exit(1);
  }

}

/**
*
* @function
* @name getLoggerConfiguration
* @description Récupérer la configuration des logs du serveur
* @param {json} userConfiguration - Configuration de l'application
* @return {json} Configuration des logs du serveur
*
*/

function getLoggerConfiguration(userConfiguration) {

  console.log("Recuperation de la configuration du logger...");

  let logsConf;
  let userLogConfigurationFile;

  if (userConfiguration) {

    if (userConfiguration.application) {

      if (userConfiguration.application.logs) {

        if (userConfiguration.application.logs.configuration) {

          userLogConfigurationFile = userConfiguration.application.logs.configuration;

          // chemin absolu du fichier
          let file = path.resolve(__dirname,userLogConfigurationFile);

          // vérification de l'exitence du fichier
          if (fs.existsSync(file)) {
            //Lecture du fichier de configuration des logs
            logsConf = JSON.parse(fs.readFileSync(file));
          } else {
            console.log("Mauvaise configuration: fichier de configuration des logs inexistant:");
            console.log(file);
            process.exit(1);
          }

        } else {
          console.log("Mauvais configuration: 'application.logs.configuration' absent.");
          process.exit(1);
        }

      } else {
        console.log("Mauvais configuration: 'application.logs' absent.");
        process.exit(1);
      }

    } else {
      console.log("Mauvais configuration: 'application' absent.");
      process.exit(1);
    }

  } else {
    console.log("Absence de configuration pour l'application.");
    process.exit(1);
  }

  return logsConf;

}


// Lancement de l'application
start();
