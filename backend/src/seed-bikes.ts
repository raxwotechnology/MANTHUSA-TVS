import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

/**
 * TVS Official Stock Bikes Seed Script (Exactly 36 Stock Units)
 * Sourced 100% from D:\Intern\A\MANTHUSA-TVS\A specifications:
 * - STOCK.xlsx: Exact Round No, Part No, Model, Chassis No, Engine No, and Stock Allocation
 * - SELLING PRICE.txt & Motorcycle.docx: Exact Selling Prices and Full TVS Technical Specifications
 * - Temporary Image URL: https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80
 */

export const tvsBikesCatalog = [
  {
    "stockNumber": "TVS-STK-S613-8-01",
    "make": "TVS",
    "model": "NTORQ RE",
    "variant": "NTORQ-REDISC-REDBLK-SKD",
    "partNumber": "NTORQ-REDISC-REDBLK-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Red Black",
    "roundNumber": "S613/8",
    "chassisNumber": "MD626AG70T2C00641",
    "engineNumber": "BG7CT2000610",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #1 (NTORQ RE) - Round S613/8.",
    "description": "Official showroom inventory unit for NTORQ RE (NTORQ-REDISC-REDBLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AG70T2C00641, Engine: BG7CT2000610, Round: S613/8.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Red Black",
        "code": "CLR-1",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-REDBLK-SKD",
        "code": "TVS-STK-S613-8-01",
        "price": 799000,
        "colors": [
          "Red Black"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S853-22-02",
    "make": "TVS",
    "model": "NTORQ XP",
    "variant": "NTORQ-XPDISC-BLK-SKD",
    "partNumber": "NTORQ-XPDISC-BLK-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.8 cc",
    "engineType": "124.8 cc, Single-cylinder, 3-valve, Air-cooled, Race-Tuned CVTi-REVV",
    "maxPower": "10.2 PS (7.5 kW) @ 7,000 rpm",
    "maxTorque": "10.8 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "98 km/h",
    "mileage": 48,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Forks",
    "rearSuspension": "Gas-Filled Hydraulic Monoshock",
    "wheelType": "12-inch Sporty Red-Coated Alloy Wheels",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "116 kg",
    "smartFeatures": [
      "Most Powerful 125cc in its Class: 10.2 HP Power Output",
      "Dual Riding Modes: Race Mode & Street Mode",
      "First-in-Segment Voice Assist SmartXonnect Integration",
      "Red-Accented Alloy Wheels & Carbon Fiber Finish Texture",
      "Lap Timer, Top Speed Recorder & 0-60 km/h Acceleration Timer"
    ],
    "color": "Matte Black",
    "roundNumber": "S853/22",
    "chassisNumber": "MD626BK35T2F01657",
    "engineNumber": "AK3FT2100836",
    "sellingPrice": 849000,
    "purchasePrice": 721650,
    "totalInvestment": 741177,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #2 (NTORQ XP) - Round S853/22.",
    "description": "Official showroom inventory unit for NTORQ XP (NTORQ-XPDISC-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626BK35T2F01657, Engine: AK3FT2100836, Round: S853/22.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Black",
        "code": "CLR-2",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-XPDISC-BLK-SKD",
        "code": "TVS-STK-S853-22-02",
        "price": 849000,
        "colors": [
          "Matte Black"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S880-70-03",
    "make": "TVS",
    "model": "NTORQ DISC-FI",
    "variant": "NTORQ-DISC-FI-NGRAY-SKD",
    "partNumber": "NTORQ-DISC-FI-NGRAY-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.8 cc",
    "engineType": "124.8 cc, Single-cylinder, 3-valve, Air-cooled Fuel-Injected (RT-Fi)",
    "maxPower": "9.4 PS @ 7,000 rpm",
    "maxTorque": "10.6 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Roto Petal Disc",
    "rearBrake": "130mm Drum",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Gas-Filled Hydraulic Damper",
    "wheelType": "12-inch Alloy",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Trendsetting Matte Nardo Gray Supercar Aesthetic",
      "Front 220mm Petal Disc with RT-Fi Engine Response",
      "SmartXonnect Bluetooth Console with Ride Analytics",
      "Gaming-Console Inspired Digital Speedometer",
      "Engine Kill Switch & Pass-by Light Switch"
    ],
    "color": "Nardo Gray",
    "roundNumber": "S880/70",
    "chassisNumber": "MD626AK36T2F06411",
    "engineNumber": "AK3FT2605976",
    "sellingPrice": 759000,
    "purchasePrice": 645150,
    "totalInvestment": 662607,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #3 (NTORQ DISC-FI) - Round S880/70.",
    "description": "Official showroom inventory unit for NTORQ DISC-FI (NTORQ-DISC-FI-NGRAY-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK36T2F06411, Engine: AK3FT2605976, Round: S880/70. NOTE: SHOW ROOM DAMAGE",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Nardo Gray",
        "code": "CLR-3",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-DISC-FI-NGRAY-SKD",
        "code": "TVS-STK-S880-70-03",
        "price": 759000,
        "colors": [
          "Nardo Gray"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S889-33-04",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S889/33",
    "chassisNumber": "MD625CK22T1F01914",
    "engineNumber": "AK2FT1101812",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #4 (SPORTELS) - Round S889/33.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK22T1F01914, Engine: AK2FT1101812, Round: S889/33.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-4",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S889-33-04",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S906-82-05",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S906/82",
    "chassisNumber": "MD625CK2XT1F02230",
    "engineNumber": "AK2FT1002152",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #5 (SPORTELS) - Round S906/82.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK2XT1F02230, Engine: AK2FT1002152, Round: S906/82.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-5",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S906-82-05",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S900-41-06",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-DBL-SKD",
    "partNumber": "JUPITER110-FI-SXC-DBL-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc, Single-cylinder, 4-stroke, Air-cooled with iGO Assist",
    "maxPower": "8.02 PS (8.0 hp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with iGO Assist Tech Boost)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Start (ISG Silent Start)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Rear Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "Twin Tube Inverted Gas-Filled Shock with 3-Step Preload",
    "wheelType": "12-inch Premium Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Digital Color LCD Cluster with Turn-by-Turn Navigation",
      "iGO Assist Electric Torque Boost for Quick Overtakes",
      "Front Fuel Fill without Disembarking",
      "Massive 33L Under-Seat Storage (Fits 2 Full-Face Helmets)",
      "Infinity LED Light Bar with Integrated Turn Indicators"
    ],
    "color": "Dawn Blue Matte",
    "roundNumber": "S900/41",
    "chassisNumber": "MD626EG55T1F18606",
    "engineNumber": "LG5FT1607458",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #6 (JUPITER110) - Round S900/41.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-DBL-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG55T1F18606, Engine: LG5FT1607458, Round: S900/41.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Dawn Blue Matte",
        "code": "CLR-6",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-DBL-SKD",
        "code": "TVS-STK-S900-41-06",
        "price": 724000,
        "colors": [
          "Dawn Blue Matte"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S900-61-07",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-DBL-SKD",
    "partNumber": "JUPITER110-FI-SXC-DBL-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc, Single-cylinder, 4-stroke, Air-cooled with iGO Assist",
    "maxPower": "8.02 PS (8.0 hp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with iGO Assist Tech Boost)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Start (ISG Silent Start)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Rear Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "Twin Tube Inverted Gas-Filled Shock with 3-Step Preload",
    "wheelType": "12-inch Premium Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Digital Color LCD Cluster with Turn-by-Turn Navigation",
      "iGO Assist Electric Torque Boost for Quick Overtakes",
      "Front Fuel Fill without Disembarking",
      "Massive 33L Under-Seat Storage (Fits 2 Full-Face Helmets)",
      "Infinity LED Light Bar with Integrated Turn Indicators"
    ],
    "color": "Dawn Blue Matte",
    "roundNumber": "S900/61",
    "chassisNumber": "MD626EG50T1F18898",
    "engineNumber": "LG5FT1807722",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #7 (JUPITER110) - Round S900/61.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-DBL-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG50T1F18898, Engine: LG5FT1807722, Round: S900/61.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Dawn Blue Matte",
        "code": "CLR-7",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-DBL-SKD",
        "code": "TVS-STK-S900-61-07",
        "price": 724000,
        "colors": [
          "Dawn Blue Matte"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S902-12-08",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-DBL-SKD",
    "partNumber": "JUPITER110-FI-SXC-DBL-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc, Single-cylinder, 4-stroke, Air-cooled with iGO Assist",
    "maxPower": "8.02 PS (8.0 hp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with iGO Assist Tech Boost)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Start (ISG Silent Start)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Rear Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "Twin Tube Inverted Gas-Filled Shock with 3-Step Preload",
    "wheelType": "12-inch Premium Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Digital Color LCD Cluster with Turn-by-Turn Navigation",
      "iGO Assist Electric Torque Boost for Quick Overtakes",
      "Front Fuel Fill without Disembarking",
      "Massive 33L Under-Seat Storage (Fits 2 Full-Face Helmets)",
      "Infinity LED Light Bar with Integrated Turn Indicators"
    ],
    "color": "Dawn Blue Matte",
    "roundNumber": "S902/12",
    "chassisNumber": "MD626EG57T1F22785",
    "engineNumber": "LG5FT1809050",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #8 (JUPITER110) - Round S902/12.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-DBL-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG57T1F22785, Engine: LG5FT1809050, Round: S902/12.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Dawn Blue Matte",
        "code": "CLR-8",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-DBL-SKD",
        "code": "TVS-STK-S902-12-08",
        "price": 724000,
        "colors": [
          "Dawn Blue Matte"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S902-20-09",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-DBL-SKD",
    "partNumber": "JUPITER110-FI-SXC-DBL-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc, Single-cylinder, 4-stroke, Air-cooled with iGO Assist",
    "maxPower": "8.02 PS (8.0 hp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with iGO Assist Tech Boost)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Start (ISG Silent Start)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Rear Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "Twin Tube Inverted Gas-Filled Shock with 3-Step Preload",
    "wheelType": "12-inch Premium Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Digital Color LCD Cluster with Turn-by-Turn Navigation",
      "iGO Assist Electric Torque Boost for Quick Overtakes",
      "Front Fuel Fill without Disembarking",
      "Massive 33L Under-Seat Storage (Fits 2 Full-Face Helmets)",
      "Infinity LED Light Bar with Integrated Turn Indicators"
    ],
    "color": "Dawn Blue Matte",
    "roundNumber": "S902/20",
    "chassisNumber": "MD626EG55T1F22851",
    "engineNumber": "LG5FT1309047",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #9 (JUPITER110) - Round S902/20.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-DBL-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG55T1F22851, Engine: LG5FT1309047, Round: S902/20.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Dawn Blue Matte",
        "code": "CLR-9",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-DBL-SKD",
        "code": "TVS-STK-S902-20-09",
        "price": 724000,
        "colors": [
          "Dawn Blue Matte"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S955-57-10",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-COP-SKD",
    "partNumber": "JUPITER110-FI-SXC-COP-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc Single-cylinder, 4-stroke, Air-cooled Fuel-Injected",
    "maxPower": "8.02 PS (7.91 bhp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with Integrated iGO Assist)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Silent Start (ISG)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Front Suspension",
    "rearSuspension": "Twin Tube Inverted Gas Shock",
    "wheelType": "12-inch Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Full Color Digital Cluster with Caller ID",
      "Integrated iGO Assist Technology for Instant Power",
      "Front Body Fuel Filler with One-Touch Key Operation",
      "33 Litre Mega Glove & Luggage Storage Compartment",
      "Emergency Brake Warning & Hazard Indicators"
    ],
    "color": "Matte Galactic Copper",
    "roundNumber": "S955/57",
    "chassisNumber": "MD626EG58T1G05786",
    "engineNumber": "LG5GT1802036",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #10 (JUPITER110) - Round S955/57.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-COP-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG58T1G05786, Engine: LG5GT1802036, Round: S955/57.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Galactic Copper",
        "code": "CLR-10",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-COP-SKD",
        "code": "TVS-STK-S955-57-10",
        "price": 724000,
        "colors": [
          "Matte Galactic Copper"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S955-73-11",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-COP-SKD",
    "partNumber": "JUPITER110-FI-SXC-COP-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc Single-cylinder, 4-stroke, Air-cooled Fuel-Injected",
    "maxPower": "8.02 PS (7.91 bhp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with Integrated iGO Assist)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Silent Start (ISG)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Front Suspension",
    "rearSuspension": "Twin Tube Inverted Gas Shock",
    "wheelType": "12-inch Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Full Color Digital Cluster with Caller ID",
      "Integrated iGO Assist Technology for Instant Power",
      "Front Body Fuel Filler with One-Touch Key Operation",
      "33 Litre Mega Glove & Luggage Storage Compartment",
      "Emergency Brake Warning & Hazard Indicators"
    ],
    "color": "Matte Galactic Copper",
    "roundNumber": "S955/73",
    "chassisNumber": "MD626EG59T1G05781",
    "engineNumber": "LG5GT1601992",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #11 (JUPITER110) - Round S955/73.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-COP-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG59T1G05781, Engine: LG5GT1601992, Round: S955/73.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Galactic Copper",
        "code": "CLR-11",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-COP-SKD",
        "code": "TVS-STK-S955-73-11",
        "price": 724000,
        "colors": [
          "Matte Galactic Copper"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S961-3-12",
    "make": "TVS",
    "model": "NTORQ XP",
    "variant": "NTORQ-XPDISC-RED-SKD",
    "partNumber": "NTORQ-XPDISC-RED-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.8 cc",
    "engineType": "124.8 cc, Single-cylinder, 4-stroke, Air-cooled, Fuel-Injected (CVTi-REVV)",
    "maxPower": "10.2 PS (7.5 kW) @ 7,000 rpm",
    "maxTorque": "10.8 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "98 km/h",
    "mileage": 48,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "Front Petal Disc Brake",
    "rearBrake": "Rear Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "High-Tuned Hydraulic Monoshock",
    "wheelType": "Tubeless Tyres with Sporty Red Alloy Wheels",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "116 kg",
    "smartFeatures": [
      "Over 10 HP Class-Leading Acceleration with 98 km/h Top Speed",
      "Race Red Tri-Tone Performance Bodywork",
      "TVS SmartXonnect Voice Assist (Navigation, Calls & SMS)",
      "Race Telemetry & Best Lap Tracker",
      "Front Petal Disc Brake with Synchronous Braking (SBT)"
    ],
    "color": "Race Red",
    "roundNumber": "S961/3",
    "chassisNumber": "MD626BK37T2G08970",
    "engineNumber": "AK3GT2404369",
    "sellingPrice": 849000,
    "purchasePrice": 721650,
    "totalInvestment": 741177,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #12 (NTORQ XP) - Round S961/3.",
    "description": "Official showroom inventory unit for NTORQ XP (NTORQ-XPDISC-RED-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626BK37T2G08970, Engine: AK3GT2404369, Round: S961/3. NOTE: SHOWROOM DAMAGE",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Race Red",
        "code": "CLR-12",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-XPDISC-RED-SKD",
        "code": "TVS-STK-S961-3-12",
        "price": 849000,
        "colors": [
          "Race Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S976-12-13",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S976/12",
    "chassisNumber": "MD625CK27T1G02852",
    "engineNumber": "AK2GT1602384",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #13 (SPORTELS) - Round S976/12.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK27T1G02852, Engine: AK2GT1602384, Round: S976/12.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-13",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S976-12-13",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S976-24-14",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S976/24",
    "chassisNumber": "MD625CK29T1G00925",
    "engineNumber": "AK2GT1300447",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #14 (SPORTELS) - Round S976/24.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK29T1G00925, Engine: AK2GT1300447, Round: S976/24.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-14",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S976-24-14",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S976-43-15",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S976/43",
    "chassisNumber": "MD625CK29T1G02853",
    "engineNumber": "AK2GT1202409",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #15 (SPORTELS) - Round S976/43.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK29T1G02853, Engine: AK2GT1202409, Round: S976/43.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-15",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S976-43-15",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S992-27-16",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-COP-SKD",
    "partNumber": "JUPITER110-FI-SXC-COP-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc Single-cylinder, 4-stroke, Air-cooled Fuel-Injected",
    "maxPower": "8.02 PS (7.91 bhp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with Integrated iGO Assist)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Silent Start (ISG)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Front Suspension",
    "rearSuspension": "Twin Tube Inverted Gas Shock",
    "wheelType": "12-inch Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Full Color Digital Cluster with Caller ID",
      "Integrated iGO Assist Technology for Instant Power",
      "Front Body Fuel Filler with One-Touch Key Operation",
      "33 Litre Mega Glove & Luggage Storage Compartment",
      "Emergency Brake Warning & Hazard Indicators"
    ],
    "color": "Matte Galactic Copper",
    "roundNumber": "S992/27",
    "chassisNumber": "MD626EG51T1G38421",
    "engineNumber": "LG5GT1X15530",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #16 (JUPITER110) - Round S992/27.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-COP-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG51T1G38421, Engine: LG5GT1X15530, Round: S992/27.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Galactic Copper",
        "code": "CLR-16",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-COP-SKD",
        "code": "TVS-STK-S992-27-16",
        "price": 724000,
        "colors": [
          "Matte Galactic Copper"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S992-36-17",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-COP-SKD",
    "partNumber": "JUPITER110-FI-SXC-COP-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc Single-cylinder, 4-stroke, Air-cooled Fuel-Injected",
    "maxPower": "8.02 PS (7.91 bhp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with Integrated iGO Assist)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Silent Start (ISG)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Front Suspension",
    "rearSuspension": "Twin Tube Inverted Gas Shock",
    "wheelType": "12-inch Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Full Color Digital Cluster with Caller ID",
      "Integrated iGO Assist Technology for Instant Power",
      "Front Body Fuel Filler with One-Touch Key Operation",
      "33 Litre Mega Glove & Luggage Storage Compartment",
      "Emergency Brake Warning & Hazard Indicators"
    ],
    "color": "Matte Galactic Copper",
    "roundNumber": "S992/36",
    "chassisNumber": "MD626EG59T1G51188",
    "engineNumber": "LG5GT1220701",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #17 (JUPITER110) - Round S992/36.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-COP-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG59T1G51188, Engine: LG5GT1220701, Round: S992/36.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Galactic Copper",
        "code": "CLR-17",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-COP-SKD",
        "code": "TVS-STK-S992-36-17",
        "price": 724000,
        "colors": [
          "Matte Galactic Copper"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S992-71-18",
    "make": "TVS",
    "model": "JUPITER110",
    "variant": "JUPITER110-FI-SXC-COP-SKD",
    "partNumber": "JUPITER110-FI-SXC-COP-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "113.3 cc",
    "engineType": "113.3 cc Single-cylinder, 4-stroke, Air-cooled Fuel-Injected",
    "maxPower": "8.02 PS (7.91 bhp) @ 6,500 rpm",
    "maxTorque": "9.8 Nm @ 5,000 rpm (with Integrated iGO Assist)",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "Fuel Injection (Fi)",
    "startingSystem": "Electric Silent Start (ISG)",
    "topSpeed": "85 km/h",
    "mileage": 55,
    "fuelTankCapacity": "5.1 Litres",
    "frontBrake": "220mm Front Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Front Suspension",
    "rearSuspension": "Twin Tube Inverted Gas Shock",
    "wheelType": "12-inch Alloy Wheels",
    "tyreDimensions": "Front: 90/90-12, Rear: 90/90-12 Tubeless",
    "groundClearance": "163 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "105 kg",
    "smartFeatures": [
      "SmartXonnect Full Color Digital Cluster with Caller ID",
      "Integrated iGO Assist Technology for Instant Power",
      "Front Body Fuel Filler with One-Touch Key Operation",
      "33 Litre Mega Glove & Luggage Storage Compartment",
      "Emergency Brake Warning & Hazard Indicators"
    ],
    "color": "Matte Galactic Copper",
    "roundNumber": "S992/71",
    "chassisNumber": "MD626EG54T1F43304",
    "engineNumber": "LG5FT1515485",
    "sellingPrice": 724000,
    "purchasePrice": 615400,
    "totalInvestment": 632052,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #18 (JUPITER110) - Round S992/71.",
    "description": "Official showroom inventory unit for JUPITER110 (JUPITER110-FI-SXC-COP-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626EG54T1F43304, Engine: LG5FT1515485, Round: S992/71.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Galactic Copper",
        "code": "CLR-18",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "JUPITER110-FI-SXC-COP-SKD",
        "code": "TVS-STK-S992-71-18",
        "price": 724000,
        "colors": [
          "Matte Galactic Copper"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1002-14-19",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-RARED-SKD",
    "partNumber": "NTORQ-REDISC-FI-RARED-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Race Red",
    "roundNumber": "S1002/14",
    "chassisNumber": "MD626AK38T2H12457",
    "engineNumber": "AK3HT2X10149",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #19 (NTORQ RE-FI) - Round S1002/14.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-RARED-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK38T2H12457, Engine: AK3HT2X10149, Round: S1002/14.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Race Red",
        "code": "CLR-19",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-RARED-SKD",
        "code": "TVS-STK-S1002-14-19",
        "price": 799000,
        "colors": [
          "Race Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1002-16-20",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-RARED-SKD",
    "partNumber": "NTORQ-REDISC-FI-RARED-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Race Red",
    "roundNumber": "S1002/16",
    "chassisNumber": "MD626AK31T2H12526",
    "engineNumber": "AK3HT2110300",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #20 (NTORQ RE-FI) - Round S1002/16.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-RARED-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK31T2H12526, Engine: AK3HT2110300, Round: S1002/16.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Race Red",
        "code": "CLR-20",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-RARED-SKD",
        "code": "TVS-STK-S1002-16-20",
        "price": 799000,
        "colors": [
          "Race Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S998-84-21",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-RARED-SKD",
    "partNumber": "NTORQ-REDISC-FI-RARED-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Race Red",
    "roundNumber": "S998/84",
    "chassisNumber": "MD626AK30T2H11383",
    "engineNumber": "AK3HT2409285",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #21 (NTORQ RE-FI) - Round S998/84.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-RARED-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK30T2H11383, Engine: AK3HT2409285, Round: S998/84.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Race Red",
        "code": "CLR-21",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-RARED-SKD",
        "code": "TVS-STK-S998-84-21",
        "price": 799000,
        "colors": [
          "Race Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S998-91-22",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-RARED-SKD",
    "partNumber": "NTORQ-REDISC-FI-RARED-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Race Red",
    "roundNumber": "S998/91",
    "chassisNumber": "MD626AK34T2H11435",
    "engineNumber": "AK3HT2109373",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #22 (NTORQ RE-FI) - Round S998/91.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-RARED-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK34T2H11435, Engine: AK3HT2109373, Round: S998/91.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Race Red",
        "code": "CLR-22",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-RARED-SKD",
        "code": "TVS-STK-S998-91-22",
        "price": 799000,
        "colors": [
          "Race Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1009-76-23",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-GRY-SKD",
    "partNumber": "SPORTELS110-FI-GRY-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled ETFi Engine",
    "maxPower": "8.18 PS @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi EcoThrust Fuel Injection System",
      "4-Speed Constant Mesh Transmission",
      "High Efficiency Paper Air Filter Element",
      "Dual-Tone Grey Red Premium Graphics",
      "Low Maintenance Commuter Engineering"
    ],
    "color": "Grey Red",
    "roundNumber": "S1009/76",
    "chassisNumber": "MD625CK2XT1H04825",
    "engineNumber": "AK2HT1704487",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #23 (SPORTELS) - Round S1009/76.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-GRY-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK2XT1H04825, Engine: AK2HT1704487, Round: S1009/76.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Grey Red",
        "code": "CLR-23",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-GRY-SKD",
        "code": "TVS-STK-S1009-76-23",
        "price": 629000,
        "colors": [
          "Grey Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1009-77-24",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-GRY-SKD",
    "partNumber": "SPORTELS110-FI-GRY-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled ETFi Engine",
    "maxPower": "8.18 PS @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi EcoThrust Fuel Injection System",
      "4-Speed Constant Mesh Transmission",
      "High Efficiency Paper Air Filter Element",
      "Dual-Tone Grey Red Premium Graphics",
      "Low Maintenance Commuter Engineering"
    ],
    "color": "Grey Red",
    "roundNumber": "S1009/77",
    "chassisNumber": "MD625CK2XT1H04789",
    "engineNumber": "AK2HT1904502",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #24 (SPORTELS) - Round S1009/77.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-GRY-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK2XT1H04789, Engine: AK2HT1904502, Round: S1009/77.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Grey Red",
        "code": "CLR-24",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-GRY-SKD",
        "code": "TVS-STK-S1009-77-24",
        "price": 629000,
        "colors": [
          "Grey Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1021-110-25",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-MRBLU-SKD",
    "partNumber": "NTORQ-REDISC-FI-MRBLU-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Marine Blue",
    "roundNumber": "S1021/110",
    "chassisNumber": "MD626AK35T2H13002",
    "engineNumber": "AK3HT2410502",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #25 (NTORQ RE-FI) - Round S1021/110.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-MRBLU-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK35T2H13002, Engine: AK3HT2410502, Round: S1021/110.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Marine Blue",
        "code": "CLR-25",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-MRBLU-SKD",
        "code": "TVS-STK-S1021-110-25",
        "price": 799000,
        "colors": [
          "Marine Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1021-112-26",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-MRBLU-SKD",
    "partNumber": "NTORQ-REDISC-FI-MRBLU-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Marine Blue",
    "roundNumber": "S1021/112",
    "chassisNumber": "MD626AK31T2H13451",
    "engineNumber": "AK3HT2X11120",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #26 (NTORQ RE-FI) - Round S1021/112.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-MRBLU-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK31T2H13451, Engine: AK3HT2X11120, Round: S1021/112.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Marine Blue",
        "code": "CLR-26",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-MRBLU-SKD",
        "code": "TVS-STK-S1021-112-26",
        "price": 799000,
        "colors": [
          "Marine Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1021-128-27",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-MRBLU-SKD",
    "partNumber": "NTORQ-REDISC-FI-MRBLU-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Marine Blue",
    "roundNumber": "S1021/128",
    "chassisNumber": "MD626AK32T2H13460",
    "engineNumber": "AK3HT2611161",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #27 (NTORQ RE-FI) - Round S1021/128.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-MRBLU-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK32T2H13460, Engine: AK3HT2611161, Round: S1021/128.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Marine Blue",
        "code": "CLR-27",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-MRBLU-SKD",
        "code": "TVS-STK-S1021-128-27",
        "price": 799000,
        "colors": [
          "Marine Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1021-156-28",
    "make": "TVS",
    "model": "NTORQ RE-FI",
    "variant": "NTORQ-REDISC-FI-MRBLU-SKD",
    "partNumber": "NTORQ-REDISC-FI-MRBLU-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.79 cc",
    "engineType": "124.79 cc, 4-stroke, Single-cylinder, Air-cooled, 3-valve Engine",
    "maxPower": "9.4 PS (6.9 kW) @ 7,500 rpm",
    "maxTorque": "10.5 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Hydraulic Damper",
    "wheelType": "12-inch Diamond Cut Alloy with Red Accents",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Signature T-Shaped Full LED Headlamp with Chequered Flag Livery",
      "Hazard Light Switch for Safety",
      "Front 220mm Petal Disc Brake with Synchronous Braking (SBT)",
      "Race-Tuned SmartXonnect Bluetooth Cockpit",
      "Aggressive Race Edition Red-Black Decals & 3D Badging"
    ],
    "color": "Marine Blue",
    "roundNumber": "S1021/156",
    "chassisNumber": "MD626AK3XT2H13450",
    "engineNumber": "AK3HT2011156",
    "sellingPrice": 799000,
    "purchasePrice": 679150,
    "totalInvestment": 697527,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #28 (NTORQ RE-FI) - Round S1021/156.",
    "description": "Official showroom inventory unit for NTORQ RE-FI (NTORQ-REDISC-FI-MRBLU-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK3XT2H13450, Engine: AK3HT2011156, Round: S1021/156.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Marine Blue",
        "code": "CLR-28",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-REDISC-FI-MRBLU-SKD",
        "code": "TVS-STK-S1021-156-28",
        "price": 799000,
        "colors": [
          "Marine Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1039-24-29",
    "make": "TVS",
    "model": "APACHE 1604V USD/PH",
    "variant": "APA 160USD4V-PH-MBLK-SKD",
    "partNumber": "APA 160USD4V-PH-MBLK-SKD",
    "category": "Sport Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "5-Speed Manual with Assist & Slipper Clutch",
    "engineCapacity": "159.7 cc",
    "engineType": "159.7 cc, 4-stroke, Oil-cooled, SOHC, 4-valve Fuel-Injected",
    "maxPower": "17.55 PS @ 9,250 rpm (Sport) / 15.64 PS @ 8,650 rpm (Urban/Rain)",
    "maxTorque": "14.73 Nm @ 7,500 rpm (Sport) / 14.14 Nm @ 7,250 rpm (Urban/Rain)",
    "coolingSystem": "Oil Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "114 km/h",
    "mileage": 45,
    "fuelTankCapacity": "12 Litres",
    "frontBrake": "270mm Petal Disc",
    "rearBrake": "240mm Petal Disc",
    "brakingSystem": "Dual Channel ABS",
    "frontSuspension": "Race-Tuned USD Fork",
    "rearSuspension": "Mono Shock MIG Absorber",
    "wheelType": "17-inch Matte Black Alloy with Red Decals",
    "tyreDimensions": "Front: 90/90-17, Rear: 130/70-17 Radial Tubeless",
    "groundClearance": "180 mm",
    "seatHeight": "800 mm",
    "kerbWeight": "146 kg",
    "smartFeatures": [
      "All-New Class-D LED Projector Headlamp",
      "Full Color Connected TFT Instrument Console",
      "Bluetooth SmartXonnect with Voice Telemetry",
      "Dual Channel ABS with 270mm Front / 240mm Rear Petal Discs",
      "Multi-Ride Modes: Sport, Urban & Rain"
    ],
    "color": "Matte Black",
    "roundNumber": "S1039/24",
    "chassisNumber": "MD637GE54T2K01486",
    "engineNumber": "HE5KT2601354",
    "sellingPrice": 969000,
    "purchasePrice": 823650,
    "totalInvestment": 845937,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #29 (APACHE 1604V USD/PH) - Round S1039/24.",
    "description": "Official showroom inventory unit for APACHE 1604V USD/PH (APA 160USD4V-PH-MBLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD637GE54T2K01486, Engine: HE5KT2601354, Round: S1039/24.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Black",
        "code": "CLR-29",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "APA 160USD4V-PH-MBLK-SKD",
        "code": "TVS-STK-S1039-24-29",
        "price": 969000,
        "colors": [
          "Matte Black"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1039-44-30",
    "make": "TVS",
    "model": "APACHE 1604V USD/PH",
    "variant": "APA 160USD4V-PH-MBLK-SKD",
    "partNumber": "APA 160USD4V-PH-MBLK-SKD",
    "category": "Sport Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "5-Speed Manual with Assist & Slipper Clutch",
    "engineCapacity": "159.7 cc",
    "engineType": "159.7 cc, 4-stroke, Oil-cooled, SOHC, 4-valve Fuel-Injected",
    "maxPower": "17.55 PS @ 9,250 rpm (Sport) / 15.64 PS @ 8,650 rpm (Urban/Rain)",
    "maxTorque": "14.73 Nm @ 7,500 rpm (Sport) / 14.14 Nm @ 7,250 rpm (Urban/Rain)",
    "coolingSystem": "Oil Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "114 km/h",
    "mileage": 45,
    "fuelTankCapacity": "12 Litres",
    "frontBrake": "270mm Petal Disc",
    "rearBrake": "240mm Petal Disc",
    "brakingSystem": "Dual Channel ABS",
    "frontSuspension": "Race-Tuned USD Fork",
    "rearSuspension": "Mono Shock MIG Absorber",
    "wheelType": "17-inch Matte Black Alloy with Red Decals",
    "tyreDimensions": "Front: 90/90-17, Rear: 130/70-17 Radial Tubeless",
    "groundClearance": "180 mm",
    "seatHeight": "800 mm",
    "kerbWeight": "146 kg",
    "smartFeatures": [
      "All-New Class-D LED Projector Headlamp",
      "Full Color Connected TFT Instrument Console",
      "Bluetooth SmartXonnect with Voice Telemetry",
      "Dual Channel ABS with 270mm Front / 240mm Rear Petal Discs",
      "Multi-Ride Modes: Sport, Urban & Rain"
    ],
    "color": "Matte Black",
    "roundNumber": "S1039/44",
    "chassisNumber": "MD637GE52T2K01390",
    "engineNumber": "HE5KT2501220",
    "sellingPrice": 969000,
    "purchasePrice": 823650,
    "totalInvestment": 845937,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #30 (APACHE 1604V USD/PH) - Round S1039/44.",
    "description": "Official showroom inventory unit for APACHE 1604V USD/PH (APA 160USD4V-PH-MBLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD637GE52T2K01390, Engine: HE5KT2501220, Round: S1039/44.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Black",
        "code": "CLR-30",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "APA 160USD4V-PH-MBLK-SKD",
        "code": "TVS-STK-S1039-44-30",
        "price": 969000,
        "colors": [
          "Matte Black"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1039-67-31",
    "make": "TVS",
    "model": "APACHE 1604V USD/PH",
    "variant": "APA 160USD4V-PH-MBLK-SKD",
    "partNumber": "APA 160USD4V-PH-MBLK-SKD",
    "category": "Sport Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "5-Speed Manual with Assist & Slipper Clutch",
    "engineCapacity": "159.7 cc",
    "engineType": "159.7 cc, 4-stroke, Oil-cooled, SOHC, 4-valve Fuel-Injected",
    "maxPower": "17.55 PS @ 9,250 rpm (Sport) / 15.64 PS @ 8,650 rpm (Urban/Rain)",
    "maxTorque": "14.73 Nm @ 7,500 rpm (Sport) / 14.14 Nm @ 7,250 rpm (Urban/Rain)",
    "coolingSystem": "Oil Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "114 km/h",
    "mileage": 45,
    "fuelTankCapacity": "12 Litres",
    "frontBrake": "270mm Petal Disc",
    "rearBrake": "240mm Petal Disc",
    "brakingSystem": "Dual Channel ABS",
    "frontSuspension": "Race-Tuned USD Fork",
    "rearSuspension": "Mono Shock MIG Absorber",
    "wheelType": "17-inch Matte Black Alloy with Red Decals",
    "tyreDimensions": "Front: 90/90-17, Rear: 130/70-17 Radial Tubeless",
    "groundClearance": "180 mm",
    "seatHeight": "800 mm",
    "kerbWeight": "146 kg",
    "smartFeatures": [
      "All-New Class-D LED Projector Headlamp",
      "Full Color Connected TFT Instrument Console",
      "Bluetooth SmartXonnect with Voice Telemetry",
      "Dual Channel ABS with 270mm Front / 240mm Rear Petal Discs",
      "Multi-Ride Modes: Sport, Urban & Rain"
    ],
    "color": "Matte Black",
    "roundNumber": "S1039/67",
    "chassisNumber": "MD637GE5XT2K01380",
    "engineNumber": "HE5KT2901266",
    "sellingPrice": 969000,
    "purchasePrice": 823650,
    "totalInvestment": 845937,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #31 (APACHE 1604V USD/PH) - Round S1039/67.",
    "description": "Official showroom inventory unit for APACHE 1604V USD/PH (APA 160USD4V-PH-MBLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD637GE5XT2K01380, Engine: HE5KT2901266, Round: S1039/67.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Matte Black",
        "code": "CLR-31",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "APA 160USD4V-PH-MBLK-SKD",
        "code": "TVS-STK-S1039-67-31",
        "price": 969000,
        "colors": [
          "Matte Black"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1077-100-32",
    "make": "TVS",
    "model": "NTORQ DISC-FI",
    "variant": "NTORQ-DISC-FI-NGRAY-SKD",
    "partNumber": "NTORQ-DISC-FI-NGRAY-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "CVT Automatic",
    "engineCapacity": "124.8 cc",
    "engineType": "124.8 cc, Single-cylinder, 3-valve, Air-cooled Fuel-Injected (RT-Fi)",
    "maxPower": "9.4 PS @ 7,000 rpm",
    "maxTorque": "10.6 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "95 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Roto Petal Disc",
    "rearBrake": "130mm Drum",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Suspension",
    "rearSuspension": "Gas-Filled Hydraulic Damper",
    "wheelType": "12-inch Alloy",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Trendsetting Matte Nardo Gray Supercar Aesthetic",
      "Front 220mm Petal Disc with RT-Fi Engine Response",
      "SmartXonnect Bluetooth Console with Ride Analytics",
      "Gaming-Console Inspired Digital Speedometer",
      "Engine Kill Switch & Pass-by Light Switch"
    ],
    "color": "Nardo Gray",
    "roundNumber": "S1077/100",
    "chassisNumber": "MD626AK3XT2L02742",
    "engineNumber": "AK3LT2302436",
    "sellingPrice": 759000,
    "purchasePrice": 645150,
    "totalInvestment": 662607,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #32 (NTORQ DISC-FI) - Round S1077/100.",
    "description": "Official showroom inventory unit for NTORQ DISC-FI (NTORQ-DISC-FI-NGRAY-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK3XT2L02742, Engine: AK3LT2302436, Round: S1077/100.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Nardo Gray",
        "code": "CLR-32",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-DISC-FI-NGRAY-SKD",
        "code": "TVS-STK-S1077-100-32",
        "price": 759000,
        "colors": [
          "Nardo Gray"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1082-22-33",
    "make": "TVS",
    "model": "NTORQ DISC-FI",
    "variant": "NTORQ-DISC-FI-HBLUE-SKD",
    "partNumber": "NTORQ-DISC-FI-HBLUE-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "Automatic Centrifugal Clutch (CVT)",
    "engineCapacity": "124.8 cc",
    "engineType": "Single-cylinder, 4-stroke, 3-valve, Air-cooled Fuel-Injected (RT-Fi)",
    "maxPower": "9.38 PS (7 kW) @ 7,000 rpm",
    "maxTorque": "10.6 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "94 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Roto Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Fork",
    "rearSuspension": "Toggle Link with Gas-Filled Shock",
    "wheelType": "12-inch Sport Alloy",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Exclusive Chameleon Harlequin Blue Color-Shifting Paintwork",
      "SmartXonnect Bluetooth Cluster with 60+ Connected Features",
      "Navigation Assist, Caller ID & Last Parked Location",
      "220mm Front Roto Petal Disc with Synchronous Braking",
      "USB Mobile Charger in Under-Seat Luggage Space"
    ],
    "color": "Harlequin Blue",
    "roundNumber": "S1082/22",
    "chassisNumber": "MD626AK33T2L03621",
    "engineNumber": "AK3LT2603274",
    "sellingPrice": 759000,
    "purchasePrice": 645150,
    "totalInvestment": 662607,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #33 (NTORQ DISC-FI) - Round S1082/22.",
    "description": "Official showroom inventory unit for NTORQ DISC-FI (NTORQ-DISC-FI-HBLUE-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK33T2L03621, Engine: AK3LT2603274, Round: S1082/22.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Harlequin Blue",
        "code": "CLR-33",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-DISC-FI-HBLUE-SKD",
        "code": "TVS-STK-S1082-22-33",
        "price": 759000,
        "colors": [
          "Harlequin Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S1082-5-34",
    "make": "TVS",
    "model": "NTORQ DISC-FI",
    "variant": "NTORQ-DISC-FI-HBLUE-SKD",
    "partNumber": "NTORQ-DISC-FI-HBLUE-SKD",
    "category": "Scooters",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "Automatic Centrifugal Clutch (CVT)",
    "engineCapacity": "124.8 cc",
    "engineType": "Single-cylinder, 4-stroke, 3-valve, Air-cooled Fuel-Injected (RT-Fi)",
    "maxPower": "9.38 PS (7 kW) @ 7,000 rpm",
    "maxTorque": "10.6 Nm @ 5,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "RT-Fi (Race Tuned Fuel Injection)",
    "startingSystem": "Electric Start",
    "topSpeed": "94 km/h",
    "mileage": 50,
    "fuelTankCapacity": "5.8 Litres",
    "frontBrake": "220mm Roto Petal Disc Brake",
    "rearBrake": "130mm Drum Brake",
    "brakingSystem": "Synchronous Braking Technology (SBT)",
    "frontSuspension": "Telescopic Fork",
    "rearSuspension": "Toggle Link with Gas-Filled Shock",
    "wheelType": "12-inch Sport Alloy",
    "tyreDimensions": "Front: 100/80-12, Rear: 110/80-12 Tubeless",
    "groundClearance": "155 mm",
    "seatHeight": "770 mm",
    "kerbWeight": "118 kg",
    "smartFeatures": [
      "Exclusive Chameleon Harlequin Blue Color-Shifting Paintwork",
      "SmartXonnect Bluetooth Cluster with 60+ Connected Features",
      "Navigation Assist, Caller ID & Last Parked Location",
      "220mm Front Roto Petal Disc with Synchronous Braking",
      "USB Mobile Charger in Under-Seat Luggage Space"
    ],
    "color": "Harlequin Blue",
    "roundNumber": "S1082/5",
    "chassisNumber": "MD626AK38T2L03212",
    "engineNumber": "AK3LT2502930",
    "sellingPrice": 759000,
    "purchasePrice": 645150,
    "totalInvestment": 662607,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #34 (NTORQ DISC-FI) - Round S1082/5.",
    "description": "Official showroom inventory unit for NTORQ DISC-FI (NTORQ-DISC-FI-HBLUE-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD626AK38T2L03212, Engine: AK3LT2502930, Round: S1082/5.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Harlequin Blue",
        "code": "CLR-34",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "NTORQ-DISC-FI-HBLUE-SKD",
        "code": "TVS-STK-S1082-5-34",
        "price": 759000,
        "colors": [
          "Harlequin Blue"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S922-96-35",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-GRY-SKD",
    "partNumber": "SPORTELS110-FI-GRY-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled ETFi Engine",
    "maxPower": "8.18 PS @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Hydraulic Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi EcoThrust Fuel Injection System",
      "4-Speed Constant Mesh Transmission",
      "High Efficiency Paper Air Filter Element",
      "Dual-Tone Grey Red Premium Graphics",
      "Low Maintenance Commuter Engineering"
    ],
    "color": "Grey Red",
    "roundNumber": "S922/96",
    "chassisNumber": "MD625CK2XT1F02065",
    "engineNumber": "AK2FT1902031",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #35 (SPORTELS) - Round S922/96.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-GRY-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK2XT1F02065, Engine: AK2FT1902031, Round: S922/96.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Grey Red",
        "code": "CLR-35",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-GRY-SKD",
        "code": "TVS-STK-S922-96-35",
        "price": 629000,
        "colors": [
          "Grey Red"
        ],
        "isDefault": true
      }
    ]
  },
  {
    "stockNumber": "TVS-STK-S809-40-36",
    "make": "TVS",
    "model": "SPORTELS",
    "variant": "SPORTELS110-FI-BLK-SKD",
    "partNumber": "SPORTELS110-FI-BLK-SKD",
    "category": "Commuter Motorcycles",
    "year": 2026,
    "manufacturingYear": 2026,
    "condition": "Brand New",
    "fuelType": "Petrol",
    "transmission": "4-Speed Constant Mesh",
    "engineCapacity": "109.7 cc",
    "engineType": "Single-cylinder, 4-stroke, Air-cooled with ETFi Technology",
    "maxPower": "8.18 PS (6.03 kW) @ 7,350 rpm",
    "maxTorque": "8.7 Nm @ 4,500 rpm",
    "coolingSystem": "Air Cooled",
    "fuelSystem": "ETFi (EcoThrust Fuel Injection)",
    "startingSystem": "Electric Start & Kick Start",
    "topSpeed": "90 km/h",
    "mileage": 70,
    "fuelTankCapacity": "10 Litres",
    "frontBrake": "130mm Drum Brake",
    "rearBrake": "110mm Drum Brake",
    "brakingSystem": "Synchronized Braking Technology (SBT)",
    "frontSuspension": "Telescopic Oil Damped Fork",
    "rearSuspension": "5-step Adjustable Hydraulic Shocks",
    "wheelType": "Alloy Wheels",
    "tyreDimensions": "Front: 2.75x17, Rear: 3.0x17 Tubeless",
    "groundClearance": "175 mm",
    "seatHeight": "790 mm",
    "kerbWeight": "110 kg",
    "smartFeatures": [
      "ETFi (EcoThrust Fuel Injection) Offering 15% More Mileage",
      "Behtareen 70+ km/l Real-World Commuter Mileage Record",
      "High Durability Paper Filter Element",
      "Econometer (Eco and Power Mode LED Indicators)",
      "Daytime Running Lamp (DRL) & Long Comfortable Cushion Seat"
    ],
    "color": "Black Neon",
    "roundNumber": "S809/40",
    "chassisNumber": "MD625CK2XT1F00316",
    "engineNumber": "AK2FT1900044",
    "sellingPrice": 629000,
    "purchasePrice": 534650,
    "totalInvestment": 549117,
    "status": "In Stock",
    "isPublished": true,
    "isFeatured": false,
    "shortDescription": "MANTHUSA TVS Showroom Stock Unit #36 (SPORTELS) - Round S809/40.",
    "description": "Official showroom inventory unit for SPORTELS (SPORTELS110-FI-BLK-SKD) at MANTHUSA TVS - Weliweriya Showroom (Location DL02880DVA). Chassis: MD625CK2XT1F00316, Engine: AK2FT1900044, Round: S809/40.",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80"
    ],
    "colors": [
      {
        "name": "Black Neon",
        "code": "CLR-36",
        "imageUrl": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80",
        "available": true
      }
    ],
    "variants": [
      {
        "name": "SPORTELS110-FI-BLK-SKD",
        "code": "TVS-STK-S809-40-36",
        "price": 629000,
        "colors": [
          "Black Neon"
        ],
        "isDefault": true
      }
    ]
  }
];

export async function seed36Bikes(existingConnection?: mongoose.Connection) {
  let createdConnection = false;
  let conn = existingConnection;

  if (!conn) {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://raxwotechnology_db_user:0Bk8CNwvPAenfq1y@cluster0.nziv5e7.mongodb.net/?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri, { dbName: 'test' });
    conn = mongoose.connection;
    createdConnection = true;
    console.log('Connected to MongoDB Atlas:', conn.name || 'test');
  }

  const db = conn.db;
  if (!db) {
    throw new Error('Database connection is not initialized.');
  }

  const vehiclesColl = db.collection('vehicles');
  const branchesColl = db.collection('branches');

  // Find or create default showroom branch
  let branch = await branchesColl.findOne({
    $or: [
      { name: /Weliweriya/i },
      { code: 'WELIWERIYA' },
      { name: /MANTHUSA/i }
    ]
  });

  if (!branch) {
    const branchRes = await branchesColl.insertOne({
      name: 'MANTHUSA TVS - Weliweriya Showroom',
      code: 'WELIWERIYA',
      address: 'No. 124, Kandy Road, Weliweriya',
      city: 'Weliweriya',
      district: 'Gampaha',
      phone: '+94 33 225 5880',
      mobile: '+94 77 123 4567',
      email: 'weliweriya@manthusatvs.lk',
      status: 'Active',
      isMainBranch: true,
      operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    branch = { _id: branchRes.insertedId };
    console.log('Created MANTHUSA TVS - Weliweriya Showroom branch.');
  } else {
    console.log(`Using existing branch: ${branch.name || branch._id}`);
  }

  // Clear previous vehicles to ensure ONLY the exact stock bikes exist (no extras)
  const delResult = await vehiclesColl.deleteMany({});
  console.log(`Cleared ${delResult.deletedCount} old vehicle records to match exact stock.`);

  const now = new Date();
  let count = 0;

  for (const bike of tvsBikesCatalog) {
    const bikeDoc = {
      ...bike,
      branch: branch._id,
      assignedBranch: branch._id,
      updatedAt: now,
    };

    await vehiclesColl.insertOne({
      ...bikeDoc,
      createdAt: now,
    });
    count++;
    console.log(
      `✓ [${count}/36] Seeded Stock Unit: ${bike.model} (${bike.variant}) | Round: ${bike.roundNumber} | Chassis: ${bike.chassisNumber} | Engine: ${bike.engineNumber} | Rs. ${bike.sellingPrice.toLocaleString()}`
    );
  }

  console.log(`\n🎉 Successfully seeded all ${count} TVS bikes matching exact stock report with 100% technical specifications!`);

  if (createdConnection) {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

// Allow direct CLI execution: ts-node src/seed-bikes.ts
if (require.main === module) {
  seed36Bikes().catch((err) => {
    console.error('Failed to seed 36 bikes:', err);
    process.exit(1);
  });
}
