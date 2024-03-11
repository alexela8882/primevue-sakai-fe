<script setup>
    import { ref, onMounted, defineAsyncComponent, inject, watch, reactive} from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import _ from 'lodash'
    import helper from '@/mixins/Helper';

    import { useFormDataStore } from '../../../stores/forms'

    const MutableField = defineAsyncComponent(() => import('@/components/modules/Form/MutableField.vue'))

    const props = defineProps({
        module: String,
        panel: Object,
        formPage: String
    })

    const formDataStore = useFormDataStore()
    const { fetchEntityFields  } = formDataStore
    const { getDefaultValue } = helper();

    const fields = ref([])
    const form = inject('form')
    const toast = useToast();
    const selectedProducts = ref([])
    const hiddenFields = ref([])
    const defaultValue = ref({});
    const columnWidth = ref({
      "asServiceSales":"50px",
      "business_unit_ids":"130px",
      "itemCode":"100px",
      "product_id":"270px",
      "HSNCode":"80px",
      "quantity":"80px",
      "list_price_id":"50px",
      "salesPrice":"130px",
      "discount":"90px",
      "subTotal":"130px",
      "vat":"90px",
      "status_id":"100px",
      "commisionPercentSalesAgent":"130px",
      "commisionAmountSalesAgent":"130px"
    })
    const tempProducts = ref([
  {
    "_id": "5c0723dc678f7161775a1f41",
    "price": 1,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13076678f7127291cc866",
      "name": "<p>MIRI TL gas connectors complete set</p>",
      "itemCode": "1320125",
      "modelCode": "TBA",
      "product_type_id": "Replacement Part",
      "description": "<p>MIRI TL gas connectors complete set</p>"
    }
  },
  {
    "_id": "5c0723dc678f7161775a1f43",
    "price": 1,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13075678f7127291cc85f",
      "name": "<p>MIRI TL compartment complete with lid, heaters, glass, bottom and sensors</p>",
      "itemCode": "1320124",
      "modelCode": "NA",
      "product_type_id": "Replacement Part",
      "description": "<p>MIRI TL compartment complete with lid, heaters, glass, bottom and sensors</p>"
    }
  },
  {
    "_id": "5c0723fb678f71603633a4f8",
    "price": 1,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bfba8c0678f7154e5247e92",
      "name": "<p>Shipping Charge</p>",
      "itemCode": "RSR-019",
      "modelCode": "RSR-019",
      "product_type_id": "Delivery",
      "description": "<p>Shipping Charge</p>"
    }
  },
  {
    "_id": "5c0723fb678f71603633a4fe",
    "price": 1,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12d5b678f71272c1d41ba",
      "name": "<p>Replacement parts</p>",
      "itemCode": "RSR-030",
      "modelCode": "RSR-030",
      "product_type_id": "Accessory",
      "description": "<p>Replacement parts</p>"
    }
  },
  {
    "_id": "5c07241f678f7161443ea1a6",
    "price": 10,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a142f",
      "name": "Gas connector, CO2",
      "itemCode": "1320014",
      "modelCode": "MRA-1010",
      "product_type_id": "Replacement Part",
      "description": "Gas connector, CO2"
    }
  },
  {
    "_id": "5c072446678f71603a68450e",
    "price": 20,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a142a",
      "name": "<p>Alarm Port Connector</p>",
      "itemCode": "1320049",
      "modelCode": "MRS-1031",
      "product_type_id": "Replacement Part",
      "description": "<p>Alarm Port Connector</p>"
    }
  },
  {
    "_id": "5c072446678f71603a684510",
    "price": 20,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1414",
      "name": "<p>Validation Sensor Connector</p>",
      "itemCode": "1320068",
      "modelCode": "MRS-1033",
      "product_type_id": "Replacement Part",
      "description": "<p>Validation Sensor Connector</p>"
    }
  },
  {
    "_id": "5c072446678f71603a684512",
    "price": 20,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13079678f7127291cc97a",
      "name": "<p>12V Regulator</p>",
      "itemCode": "1320102",
      "modelCode": "TBA",
      "product_type_id": "Replacement Part",
      "description": "<p>12V Regulator</p>"
    }
  },
  {
    "_id": "5c072486678f716037405b12",
    "price": 35,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1428",
      "name": "<p>BNC Connector</p>",
      "itemCode": "1320047",
      "modelCode": "MRS-1029",
      "product_type_id": "Replacement Part",
      "description": "<p>BNC Connector</p>"
    }
  },
  {
    "_id": "5c072486678f716037405b14",
    "price": 35,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1429",
      "name": "<p>USB Connector</p>",
      "itemCode": "1320048",
      "modelCode": "MRS-1030",
      "product_type_id": "Replacement Part",
      "description": "<p>USB Connector</p>"
    }
  },
  {
    "_id": "5c0724a1678f7160354af9e4",
    "price": 40,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd130e6678f71272b6450d6",
      "name": "<p>Mains cable, US</p>",
      "itemCode": "1320007",
      "modelCode": "MRA-1003",
      "product_type_id": "Replacement Part",
      "description": "<p>Mains cable, US</p>"
    }
  },
  {
    "_id": "5c0724a1678f7160354af9e8",
    "price": 40,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a141d",
      "name": "Mains cable, Schuko",
      "itemCode": "1320008",
      "modelCode": "MRA-1004",
      "product_type_id": "Replacement Part",
      "description": "Mains cable, Schuko"
    }
  },
  {
    "_id": "5c0724a1678f7160354af9ec",
    "price": 40,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13077678f7127291cc8dc",
      "name": "Mains cable, UK",
      "itemCode": "1320009",
      "modelCode": "MRA-1005",
      "product_type_id": "Replacement Part",
      "description": "Mains cable, UK"
    }
  },
  {
    "_id": "5c0724a1678f7160354af9f0",
    "price": 40,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a142e",
      "name": "Gas connector, N2",
      "itemCode": "1320013",
      "modelCode": "MRA-1009",
      "product_type_id": "Replacement Part",
      "description": "Gas connector, N2"
    }
  },
  {
    "_id": "5c0724a1678f7160354af9f4",
    "price": 40,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1430",
      "name": "Data extension cable",
      "itemCode": "1320017",
      "modelCode": "MRA-1013",
      "product_type_id": "Replacement Part",
      "description": "Data extension cable"
    }
  },
  {
    "_id": "5c0724a4678f7160354afab2",
    "price": 40,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bd1300e678f7127270833b8",
      "name": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 50L)</p>",
      "itemCode": "5170425",
      "modelCode": "COA-2024-F",
      "product_type_id": "Accessory",
      "description": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 50L)</p>"
    }
  },
  {
    "_id": "5c0724bc678f7160397579f2",
    "price": 50,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1421",
      "name": "Seal for gas box",
      "itemCode": "1320038",
      "modelCode": "MRS-1020",
      "product_type_id": "Replacement Part",
      "description": "Seal for gas box"
    }
  },
  {
    "_id": "5c0724bc678f7160397579f6",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1422",
      "name": "Seal for elecronics box",
      "itemCode": "1320039",
      "modelCode": "MRS-1021",
      "product_type_id": "Replacement Part",
      "description": "Seal for elecronics box"
    }
  },
  {
    "_id": "5c0724bc678f7160397579fa",
    "price": 50,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13078678f7127291cc913",
      "name": "<p>Cooling fan</p>",
      "itemCode": "1320040",
      "modelCode": "MRS-1022",
      "product_type_id": "Replacement Part",
      "description": "<p>Cooling fan</p>"
    }
  },
  {
    "_id": "5c0724bc678f7160397579fe",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a142b",
      "name": "<p>Mains Connector</p>",
      "itemCode": "1320067",
      "modelCode": "MRS-1032",
      "product_type_id": "Replacement Part",
      "description": "<p>Mains Connector</p>"
    }
  },
  {
    "_id": "5c0724bc678f716039757a02",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12f82678f71272653a06e",
      "name": "Feet (set of 4)",
      "itemCode": "1320010",
      "modelCode": "MRA-1006",
      "product_type_id": "Replacement Part",
      "description": "Feet (set of 4)"
    }
  },
  {
    "_id": "5c0724bc678f716039757a04",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1411",
      "name": "<p>Key SP</p>",
      "itemCode": "1320046",
      "modelCode": "MRS-1028",
      "product_type_id": "Replacement Part",
      "description": "<p>Key SP</p>"
    }
  },
  {
    "_id": "5c0724bc678f716039757a06",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a140c",
      "name": "<p>Key Up</p>",
      "itemCode": "1320025",
      "modelCode": "MRS-1007",
      "product_type_id": "Replacement Part",
      "description": "<p>Key Up</p>"
    }
  },
  {
    "_id": "5c0724bc678f716039757a08",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a140d",
      "name": "<p>Key Down</p>",
      "itemCode": "1320026",
      "modelCode": "MRS-1008",
      "product_type_id": "Replacement Part",
      "description": "<p>Key Down</p>"
    }
  },
  {
    "_id": "5c0724bc678f716039757a0a",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a140e",
      "name": "<p>Key Right</p>",
      "itemCode": "1320027",
      "modelCode": "MRS-1009",
      "product_type_id": "Replacement Part",
      "description": "<p>Key Right</p>"
    }
  },
  {
    "_id": "5c0724bc678f716039757a0c",
    "price": 45,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a140f",
      "name": "<p>Key Alarm Mute</p>",
      "itemCode": "1320028",
      "modelCode": "MRS-1028",
      "product_type_id": "Replacement Part",
      "description": "<p>Key Alarm Mute</p>"
    }
  },
  {
    "_id": "5c0724e2678f7160383775b2",
    "price": 55,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a141e",
      "name": "Set of labels for MRI-6A10",
      "itemCode": "1320029",
      "modelCode": "MRS-1011",
      "product_type_id": "Replacement Part",
      "description": "Set of labels for MRI-6A10"
    }
  },
  {
    "_id": "5c0724e2678f7160383775b4",
    "price": 55,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13078678f7127291cc908",
      "name": "Window for display",
      "itemCode": "1320035",
      "modelCode": "MRS-1017",
      "product_type_id": "Replacement Part",
      "description": "Window for display"
    }
  },
  {
    "_id": "5c0724e2678f7160383775b6",
    "price": 55,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1427",
      "name": "Inlet, twin fused/switch",
      "itemCode": "1320057",
      "modelCode": "MRS-1027",
      "product_type_id": "Replacement Part",
      "description": "Inlet, twin fused/switch"
    }
  },
  {
    "_id": "5c072502678f7160344d2c17",
    "price": 65,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1424",
      "name": "Serial to USB converter",
      "itemCode": "1320042",
      "modelCode": "MRS-1024",
      "product_type_id": "Replacement Part",
      "description": "Serial to USB converter"
    }
  },
  {
    "_id": "5c072505678f7160344d2cf9",
    "price": 70,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13089678f7127291cce31",
      "name": "<p>Bottle for HS-1</p>",
      "itemCode": "1320078",
      "modelCode": "NA",
      "product_type_id": "Replacement Part",
      "description": "<p>Bottle for HS-1</p>"
    }
  },
  {
    "_id": "5c072505678f7160344d2cfb",
    "price": 70,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13083678f7127291ccc33",
      "name": "<p>Bulb for Light source</p>",
      "itemCode": "1320152",
      "modelCode": "NA",
      "product_type_id": "Replacement Part",
      "description": "<p>Bulb for Light source</p>"
    }
  },
  {
    "_id": "5c07251a678f7161775a225d",
    "price": 70,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12fd2678f71272d5a822a",
      "name": "<p>UV Lamp for 4ft, 5ft, 6ft Cabinets except AC3-4B</p>",
      "itemCode": "5170255",
      "modelCode": "UV-30A",
      "product_type_id": "Accessory",
      "description": "<p>UV Lamp for 4ft, 5ft, 6ft Cabinets except AC3-4B</p>"
    }
  },
  {
    "_id": "5c072520678f7161775a23e1",
    "price": 74,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12dbf678f71272d5a77e2",
      "name": "<p>Prefilter, Cardboard Frame, PF-C (565 x 440 x 15mm) Needs 2 for 4’; 3 for 6’</p>",
      "itemCode": "5090016",
      "modelCode": "CRF/PF-C",
      "product_type_id": "Accessory",
      "description": "Prefilter, Cardboard Frame, PF-C (565 x 440 x 15mm) Needs 2 for 4’; 3 for 6’"
    }
  },
  {
    "_id": "5c07255a678f71603a6846a4",
    "price": 90,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13079678f7127291cc959",
      "name": "<p>MIRI TL Set of Labels</p>",
      "itemCode": "1320126",
      "modelCode": "TBA",
      "product_type_id": "Replacement Part",
      "description": "<p>MIRI TL Set of Labels</p>"
    }
  },
  {
    "_id": "5c07255a678f71603a6846a6",
    "price": 100,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13083678f7127291ccc3f",
      "name": "<p><span style=\"color: rgb(36, 36, 36);\">Set of in-line filters, 2 pcs internal + 2 pcs external&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p><p><span style=\"color: rgb(36, 36, 36);\">To be replaced once every 12 months</span></p>",
      "itemCode": "1320005",
      "modelCode": "MRA-1001",
      "product_type_id": "Replacement Part",
      "description": "<p><span style=\"color: rgb(36, 36, 36);\">Set of in-line filters, 2 pcs internal + 2 pcs external&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p><p><span style=\"color: rgb(36, 36, 36);\">To be replaced once every 12 months</span></p>"
    }
  },
  {
    "_id": "5c07257c678f7160337c75de",
    "price": 100,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bd1300e678f7127270833c8",
      "name": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 170L)</p>",
      "itemCode": "5170327",
      "modelCode": "COA-2007-F",
      "product_type_id": "Accessory",
      "description": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 170L)</p>"
    }
  },
  {
    "_id": "5c072584678f7160337c77ec",
    "price": 110,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1426",
      "name": "Solid state relay",
      "itemCode": "1320044",
      "modelCode": "MRS-1026",
      "product_type_id": "Replacement Part",
      "description": "Solid state relay"
    }
  },
  {
    "_id": "5c072586678f7160337c7872",
    "price": 130,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bd130c9678f712759125983",
      "name": "<p>Option, Reversed Door Swing, Factory Installed</p>",
      "itemCode": "5170474",
      "modelCode": "COA-1004",
      "product_type_id": "Accessory",
      "description": "<p>Option, Reversed Door Swing, Factory Installed</p>"
    }
  },
  {
    "_id": "5c072586678f7160337c7874",
    "price": 130,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd1300f678f712727083408",
      "name": "<p>Accessory, Stacking Kit</p>",
      "itemCode": "5170483",
      "modelCode": "COA-2008-F",
      "product_type_id": "Accessory",
      "description": "<p>Accessory, Stacking Kit</p>"
    }
  },
  {
    "_id": "5c0725b9678f7160354afd3c",
    "price": 125,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13088678f7127291ccdc7",
      "name": "<p>Set of 6 pcs Gas Connection Tube</p>",
      "itemCode": "1320066",
      "modelCode": "MRA-1104",
      "product_type_id": "Replacement Part",
      "description": "<p>Set of 6 pcs. Gas Connection Tube; Accessory for MRI- GA (to connect to MRI-6A10 6x gas sampling ports)</p>"
    }
  },
  {
    "_id": "5c0725d9678f716039757df0",
    "price": 150,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12f7b678f712726539e21",
      "name": "<p>Internal Gas Pump</p>",
      "itemCode": "1320023",
      "modelCode": "MRS-1005",
      "product_type_id": "Replacement Part",
      "description": "<p>Internal Gas Pump</p>"
    }
  },
  {
    "_id": "5c072612678f7160344d2e13",
    "price": 160,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05c678f7161775a13c6",
      "name": "<p>SafeSens SV2 Sensor (shelf-life 12 months)</p>",
      "itemCode": "1081277",
      "modelCode": "TBA",
      "product_type_id": "Accessory",
      "description": "<p>SafeSens SV2 Sensor</p>"
    }
  },
  {
    "_id": "5c072618678f7160344d2f61",
    "price": 180,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13083678f7127291ccc4c",
      "name": "<p>VOC/HEPA Filter for Miri or Miri TL (To be replaced once every 3 months)</p>",
      "itemCode": "1320011",
      "modelCode": "MRA-1007",
      "product_type_id": "Replacement Part",
      "description": "<p>VOC/HEPA Filter for Miri or Miri TL (To be replaced once every 3 months)</p>"
    }
  },
  {
    "_id": "5c0774e0678f7160337c7ab8",
    "price": 200,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1434",
      "name": "<p>Circulation Box</p>",
      "itemCode": "1320021",
      "modelCode": "MRS-1003",
      "product_type_id": "Replacement Part",
      "description": "Circulation box"
    }
  },
  {
    "_id": "5c07750e678f71603633aa48",
    "price": 210,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd12e18678f71272a3489c3",
      "name": "O2 Sensor To be replaced once every 12 months (ONLY FOR MRI-TL)",
      "itemCode": "1320144",
      "modelCode": "TBA",
      "product_type_id": "Replacement Part",
      "description": "O2 Sensor To be replaced once every 12 months (ONLY FOR MRI-TL)"
    }
  },
  {
    "_id": "5c07750f678f71603633aa58",
    "price": 210,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5bd13085678f7127291cccd5",
      "name": "<p>O2 Sensor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>To be replaced once every 12 months (ONLY FOR MRI-6A10)</p>",
      "itemCode": "1320031",
      "modelCode": "MRS-1013",
      "product_type_id": "Replacement Part",
      "description": "<p>O2 Sensor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>To be replaced once every 12 months (ONLY FOR MRI-6A10)</p>"
    }
  },
  {
    "_id": "5c077516678f71603633ac0a",
    "price": 180,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bd1300e678f7127270833d8",
      "name": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 240L)</p>",
      "itemCode": "5170426",
      "modelCode": "COA-2025-F",
      "product_type_id": "Accessory",
      "description": "<p>Accessory, Extra SS Shelf, With 2 Support Rails (For 240L)</p>"
    }
  },
  {
    "_id": "5c07753d678f7161443ea61b",
    "price": 220,
    "inclusiveServices": [
      {
        "_id": "5bb164eb678f7106e91508fc",
        "name": "Installation and/or Parts Replacement"
      }
    ],
    "product_id": {
      "_id": "5c05d05e678f7161775a1435",
      "name": "<p>Gas Manifold</p>",
      "itemCode": "1320022",
      "modelCode": "MRS-1004",
      "product_type_id": "Replacement Part",
      "description": "<p>Gas Manifold</p>"
    }
  },
  {
    "_id": "5c077545678f7161443ea7ef",
    "price": 205,
    "inclusiveServices": [],
    "product_id": {
      "_id": "5bd12e7d678f712759124cdf",
      "name": "PC Holder",
      "itemCode": "1320140",
      "modelCode": "NA",
      "product_type_id": "Accessory",
      "description": "PC Holder for Miri"
    }
  }
])
    onMounted(async()=>{ 
        if(props.formPage=='create'){
            hiddenFields.value = ['status_id','sales_quote_id','currency_id','sort','inclusive_service_ids','commisionPercentDistributor','commisionAmountDistributor','commisionPercentSalesAgent','commisionAmountSalesAgent','discountedPriceRound','subTotalRound','discountPrice','discountedPrice']
        }else{
            hiddenFields.value = ['status_id','sales_quote_id','currency_id','sort','inclusive_service_ids']
        }
        fields.value = await fetchEntityFields("SalesOpptItem")
        defaultValue.value = getDefaultValue(fields.value,false)
        form.value.values[props.panel.panelName] = []
    })

    const toggleProductSelection = (event) => {
         op.value.toggle(event);
        if(_.isEmpty(form.value.values.main['currency_id']) || _.isNull(form.value.values.main['currency_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select currency first', position:"top-center", life: 3000 });
        }else if(_.isEmpty(form.value.values.main['pricebook_id']) || _.isNull(form.value.values.main['pricebook_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select pricebook first', position:"top-center", life: 3000 });
        }else if(!_.isEmpty(form.value.values.main['account_id']) && !_.isNull(form.value.values.main['account_id']) && _.get(form.value.values.main,'branch_id.0._id','')=='5b344ae1678f711dfc04ec3c' && !_.isEmpty(form.value.values.main['sales_type_id']) && !_.isNull(form.value.values.main['sales_type_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select sales type first', position:"top-center", life: 3000 });
        }else{
            op.value.toggle(event);
        }
        
    };

    const handleSelectionChange = (val) => {
        selectedProducts.value = val
    }

    const addProductsToTable = () =>{

        _.forEach(selectedProducts.value, function(p){
            let tmp = _.cloneDeep(defaultValue.value)
            tmp['product_id'] = p.product_id
            tmp['salesPrice'] = p.price
            tmp['listPriceCopied'] = true
            tmp['listPrice'] = p.price
            tmp['branch_id'] = form.value.values.main['branch_id']
            tmp['inclusive_service_ids'] = p.inclusiveServices
            form.value.values[props.panel.panelName].push(tmp)
        })
        selectedProducts.value = []
    }

    const fieldChange = (field,index) => {
        console.log(field,index)
        if(field=='salesPrice'){
            console.log(form.value.values[props.panel.panelName][index]['listPrice'],form.value.values[props.panel.panelName][index]['salesPrice'],form.value.values[props.panel.panelName][index]['listPrice']!=form.value.values[props.panel.panelName][index]['salesPrice'])
            if(form.value.values[props.panel.panelName][index]['listPrice']!=form.value.values[props.panel.panelName][index]['salesPrice']){
                form.value.values[props.panel.panelName][index]['listPriceCopied'] = false
            }else{
                form.value.values[props.panel.panelName][index]['listPriceCopied'] = true
            }
        }
    }

    const listPriceCopy = (index) => {
      form.value.values[props.panel.panelName][index]['salesPrice'] = form.value.values[props.panel.panelName][index]['listPrice'] 
    }

    const computeTotal = (data) =>{
      
      let branch = _.get(form.value.values.main,'branch_id._id','')
      let discount = data['discount']/100;
      let discountedPrice = data['salesPrice'] - (data['salesPrice'] * discount);
      if(branch=='5badf748678f7111186ba26e' || branch=='5f8510f0a6ebc7423b72d6f2'){
        //Esco US & US Pharma
        return _.round(discountedPrice,0) * data['quantity']
      }else if(branch=='5bfcf6c9678f71594d642a86' || branch =='5badf748678f7111186ba268'){
        // Bangladesh & Vietnam
        let vat = data['vat']/100;
        return (discountedPrice + (discountedPrice * vat)) * data['quantity']
      }else if(branch=='5c6a88e3a6ebc728735b9db2'){
        let commission = data['commisionPercentDistributor']/100
        discountedPrice = data['salesPrice'] - (data['salesPrice'] * (discount + commission));
        return discountedPrice * data['quantity']
      }else{
        return discountedPrice * data['quantity']
      }
    }

    watch(form.value.values.main, (newV,oldV) =>{
        _.forEach(form.value.values[props.panel.panelName], function(d,i){
            if(!_.isEqual(d.branch_id,form.value.values.main.branch_id)){
                form.value.values[props.panel.panelName][i]['branch_id'] = form.value.values.main.branch_id
            }
        })
    })
</script>
<template>
<div class="formSectionLabel flex align-items-center justify-content-between">
    <h6 class="mb-0" v-if="panel.sections[0].label">{{ panel.sections[0].label }}</h6>
    <el-popover placement="bottom-start" :width="880" trigger="click" @hide="addProductsToTable">
      <template #reference>
        <el-button style="margin-right: 16px">Add Products</el-button>
      </template>
      <el-table :data="tempProducts" border stripe height="250" size="small" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30" />
        <el-table-column width="100" label="Item Code" >
            <template #default="scope">
                {{ scope.row.product_id.itemCode}}
            </template>
        </el-table-column>
        <el-table-column width="120" label="Model Code">
            <template #default="scope">
                {{ scope.row.product_id.modelCode}}
            </template>
        </el-table-column>
        <el-table-column width="250" label="Product">
            <template #default="scope">
                <div v-html="scope.row.product_id.name"></div>
            </template>
        </el-table-column>
        <el-table-column width="250" label="Description">
            <template #default="scope">
                <div v-html="scope.row.product_id.description"></div>
            </template>
        </el-table-column>
        <el-table-column width="100" prop="price" label="Price" />
      </el-table>
      <div class="flex align-items-center justify-content-between mt-2">
        <el-pagination background layout="prev, pager, next" small :total="1000" />
        <el-button stype="primary" size="small">OK</el-button>
      </div>
    </el-popover>
</div>
 <DataTable :value="form.values[panel.panelName]" size="small" stripedRows  columnResizeMode="expand" tableStyle="min-width: 50rem">
    <template v-for="field in _.filter(fields, function(f){ if(!_.includes(hiddenFields,f.name)){ return true; } })" :key="field._id">
        <Column :field="field.name" :header="field.label" :style="'width:' +columnWidth[field.name]">
        <template #body="slotProps">
            <template v-if="field.name=='product_id'">
                <div v-html="slotProps.data.product_id.name"></div>
            </template>
            <template v-else-if="field.name=='list_price_id'">
                <el-checkbox v-model="form.values[panel.panelName][slotProps.index]['listPriceCopied']" :disabled="form.values[panel.panelName][slotProps.index]['listPrice']==form.values[panel.panelName][slotProps.index]['salesPrice']" @change="listPriceCopy(slotProps.index)" size="small" />
            </template>
            <template v-else-if="field.name=='subTotal'">
                {{ computeTotal(slotProps.data) }}
            </template>
            <template v-else>
                <MutableField  :config="field" :mutableIndex="slotProps.index" :keyName="panel.panelName" type="tableForm" :entity="panel.entityName" :module="module" :inputWidth="columnWidth[field.name]" @changeValue="fieldChange"/>
            </template>
        </template>
    </Column>
    </template>
    
</DataTable>

</template>