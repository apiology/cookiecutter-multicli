import { actOnInputData } from '../{{ cookiecutter.project_slug }}.js';
import AlfredPlatform from './alfred-platform.js';
import { setPlatform } from '../platform.js';

setPlatform(new AlfredPlatform());
const arg = process.argv[2];
actOnInputData(arg);
