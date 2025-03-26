//stackpress
import type Model from 'stackpress/Model';
import PageFactory from 'stackpress/admin/pages/search';
//profile
import { registry } from '../config';

export default PageFactory(registry.model.get('Profile') as Model);