import { AllPackingSlipsListService } from './all-packing-slips-list.service';
import { PackingSlipsTableService } from './packing-slips-table.service';
import { OpenPackingSlipsListService } from './open-packing-slips-list.service';
import { ReceivedPackingSlipsListService } from './received-packing-slips-list.service';

export const PACKINGSLIPS_PROVIDERS = [
  AllPackingSlipsListService,
  OpenPackingSlipsListService,
  PackingSlipsTableService,
  ReceivedPackingSlipsListService,
];
