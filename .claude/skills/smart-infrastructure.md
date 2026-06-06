---
name: smart-infrastructure
description: ทักษะด้านโครงสร้างพื้นฐานอัจฉริยะ (Smart Infrastructure) สำหรับเทศบาล ใช้เมื่อต้องการ: เขียน TOR จัดซื้อระบบ Smart Lighting, CCTV, Environmental Sensor, Smart Waste วิเคราะห์ vendor proposal ป้องกัน vendor lock-in ประเมิน ROI หรือวางแผน Smart City Master Plan
---

# ทักษะ: Smart Infrastructure สำหรับเทศบาล

## ระบบ Smart City ที่เหมาะกับเทศบาลขนาดกลาง (ประชากร ~24,000 คน)

### 1. Smart Lighting (ไฟฟ้าสาธารณะอัจฉริยะ)
**เหมาะกับ ทม.ตาคลี: สูง** — มีไฟสาธารณะอยู่แล้ว อัปเกรดได้ทันที

```
ฟังก์ชันหลัก:
- หรี่/เปิด-ปิดอัตโนมัติตามแสงธรรมชาติ/เวลา
- รายงานหลอดขาดแบบ real-time (ลดต้นทุนตรวจ)
- ปรับความสว่างตามสภาพจราจร/กิจกรรม
- ติดตามการใช้พลังงานรายหลอด

ROI โดยประมาณ:
- ลดค่าไฟ 30–50% (เทียบ HPS เดิม → LED + dimming)
- ลดค่าบำรุงรักษา ~40% (ไม่ต้องออกตรวจทุกคืน)
- คืนทุนภายใน 3–5 ปี

TOR ต้องระบุ:
- มาตรฐาน ZHAGA Book 18 (ช่องเสียบ sensor กลางแจ้ง)
- โปรโตคอล TALQ 2.x (open standard ป้องกัน vendor lock-in)
- NEMA socket หรือ Zhaga D4i compatibility
- รับประกัน LED ≥ 5 ปี / ชุดควบคุม ≥ 3 ปี
```

### 2. CCTV อัจฉริยะ (Smart Surveillance)
**เหมาะกับ ทม.ตาคลี: สูง** — เมืองขนาดกลาง ปลอดภัยสาธารณะสำคัญ

```
ฟังก์ชันพื้นฐาน (แนะนำ):
- ภาพคมชัด FullHD (1080p) ขึ้นไป
- IR Night Vision ≥ 30 เมตร
- จัดเก็บภาพ ≥ 30 วัน (NVR/Cloud)
- เข้าถึงจากศูนย์ควบคุม + mobile app (เจ้าหน้าที่)

ฟังก์ชัน AI (ระวัง PDPA):
- จดจำทะเบียนรถ (LPR) — ✅ ใช้ได้ถ้ามีฐานกฎหมาย
- นับจำนวนคน (People Counting) — ✅ ไม่ระบุตัวตน
- Face Recognition — ⚠️ ต้องทำ DPIA ก่อน

TOR ต้องระบุ:
- ONVIF Profile S/G compliance (ป้องกัน vendor lock-in)
- การเข้ารหัส TLS 1.2+ สำหรับ data in transit
- ไม่ส่งข้อมูลออกนอกประเทศโดยไม่ได้รับอนุญาต (PDPA)
- Cybersecurity: ต้องเปลี่ยน default password / patch firmware ได้
```

### 3. Environmental Sensor (เซ็นเซอร์สิ่งแวดล้อม)
**เหมาะกับ ทม.ตาคลี: กลาง** — เริ่มต้นได้ 3–5 จุด

```
พารามิเตอร์แนะนำ:
- PM2.5 / PM10 (ฝุ่นละออง)
- อุณหภูมิ / ความชื้น
- เสียงรบกวน (dB) — เหมาะกับย่านพาณิชย์
- ระดับน้ำในคูคลอง (flood early warning)

โปรโตคอลมาตรฐาน:
- LoRaWAN (พื้นที่กว้าง ค่าไฟต่ำ) — แนะนำ
- NB-IoT (ใช้โครงข่าย AIS/DTAC) — ถ้าไม่ต้องการ gateway
- WiFi / 4G (ถ้าต้องการ bandwidth สูง)

Platform: ใช้ Grafana + InfluxDB (open source) หรือ
          Microsoft Azure IoT / Google Cloud IoT
```

### 4. Smart Waste Management
**เหมาะกับ ทม.ตาคลี: กลาง** — ลดต้นทุนรถเก็บขยะได้ชัดเจน

```
ระบบ Fill-Level Sensor ในถังขยะ:
- Ultrasonic sensor วัดระดับขยะ
- ส่งข้อมูลผ่าน LoRaWAN ทุก 1–4 ชั่วโมง
- Dashboard แสดงสถานะถัง (เต็ม/ครึ่ง/ว่าง)
- Route optimization — รถไปเก็บเฉพาะถังที่เต็ม

ประโยชน์:
- ลดรอบการเก็บขยะที่ไม่จำเป็น 20–30%
- ลดค่าน้ำมันและ CO₂
- ข้อมูล baseline สำหรับ open data
```

## หลักการป้องกัน Vendor Lock-in

```
1. ระบุ Open Standard ใน TOR เสมอ
   - ไฟอัจฉริยะ: TALQ, ZHAGA, DALI-2
   - กล้อง: ONVIF
   - IoT: MQTT, LoRaWAN, FIWARE NGSI-LD
   - Data: REST API, JSON, CSV export

2. ข้อกำหนดในสัญญา
   - ผู้ขายต้องส่งมอบ source code (ถ้า custom dev)
   - ข้อมูลทั้งหมดเป็นของเทศบาล ส่งออกได้ทุกเวลา
   - ห้าม proprietary protocol ที่ไม่มีเอกสาร

3. สถาปัตยกรรมแนะนำ
   Sensor Layer → Gateway (LoRaWAN/NB-IoT)
       → City IoT Platform (FIWARE/OpenRemote)
           → Dashboard (Grafana)
               → Open Data API
```

## การประเมิน ROI และความคุ้มค่า

```
สูตรประเมินเบื้องต้น:

ROI (%) = (ผลประโยชน์รวม - ต้นทุนรวม) / ต้นทุนรวม × 100

ผลประโยชน์ที่นับได้:
- ค่าไฟที่ประหยัด (บาท/ปี)
- ค่าบำรุงรักษาที่ลดลง (บาท/ปี)
- ต้นทุนแรงงานที่ลดลง (บาท/ปี)
- มูลค่าการป้องกันความเสียหาย (น้ำท่วม อาชญากรรม)

ต้นทุนทั้งหมด (TCO — Total Cost of Ownership):
- ค่าอุปกรณ์ + ติดตั้ง
- ค่า license / subscription รายปี
- ค่าบำรุงรักษาและซ่อม
- ค่าฝึกอบรมเจ้าหน้าที่
- ค่า data storage / connectivity
```

## Smart City Maturity Model สำหรับเทศบาลไทย

```
Level 1 — Connected (เชื่อมต่อ)
  → มี WiFi สาธารณะ, CCTV พื้นฐาน, เว็บไซต์เทศบาล

Level 2 — Instrumented (มีเซ็นเซอร์)
  → Smart Lighting, Environmental Sensor, Fill-level waste

Level 3 — Integrated (บูรณาการ)
  → City Dashboard รวมข้อมูลทุกระบบ, Open Data Portal

Level 4 — Intelligent (อัจฉริยะ)
  → AI วิเคราะห์แนวโน้ม, Predictive Maintenance, Chatbot

เทศบาลขนาดกลางอย่าง ทม.ตาคลี — เป้าหมายระยะ 3 ปี: Level 2–3
```

## Checklist ก่อนอนุมัติโครงการ Smart Infrastructure
- [ ] มีงบประมาณสำหรับ maintenance ปีละเท่าไร (ไม่ใช่แค่ต้นทุนติดตั้ง)
- [ ] มีเจ้าหน้าที่ดูแลระบบ IT ที่เพียงพอ หรือต้องจ้างเพิ่ม?
- [ ] ทำ DPIA สำหรับระบบที่เก็บข้อมูลบุคคล (CCTV, sensor)
- [ ] TOR ระบุ open standard และห้าม proprietary protocol
- [ ] มีแผน data governance และ cybersecurity
- [ ] ทดสอบ pilot 3–6 เดือนก่อน rollout ทั้งเมือง
- [ ] วัดผลได้ชัดเจน (KPI ก่อน-หลัง)
