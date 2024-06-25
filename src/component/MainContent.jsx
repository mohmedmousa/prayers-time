// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { Grid, Typography,useMediaQuery  } from '@mui/material';
import Divider from '@mui/material/Divider';
import Prayer from './Prayer'
import axios from 'axios';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment'
import 'moment/dist/locale/ar-ma'
moment.locale('ar-ma');


export default function MainContent() {
  const gettimings=async()=>{
    const res= await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${city.apiName}`)
    //console.log(res.data.data)
    settimings(res.data.data.timings)
  }
  
  const [timings,settimings] = useState({
    Fajr:"4",
    Dhuhr:"12",
    Asr:"17",
    Maghrib:"21",
    Isha:"22"
  })
  //const [age, setAge] = React.useState('');

  const [city,setcity]=useState({
    displayName:" القاهرة",
    apiName:"Cairo"
  })
  
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const handleChange = (event) => {
    const selectedCity=existedCities.find((ele)=>{
      return ele.apiName == event.target.value
})
    setcity(selectedCity)
    
  };

  const existedCities = [
    {
      displayName:" القاهرة",
      apiName:"Cairo"
    },
    {
      displayName:"طنطا",
      apiName:"Tanta"
    },
    {
      displayName:"زفتى",
      apiName:"Zifta"
    }
  ]
  
  const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Maghrib", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];
  const [today,settoday]=useState('')
  const [remainingTime, setRemainingTime] = useState("");
  useEffect(()=>{
      gettimings()
  },[city])

  useEffect(()=>{
    
    const inteval=setInterval(() => {
      const time=moment()
    settoday(time.format('MMMM Do YYYY | h:mm a'))
      setupCountdownTimer()
    }, 1000);
    
    return ()=>{
      clearInterval(inteval)
    }
  },[timings])
  const setupCountdownTimer = () => {
		const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);
    const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);

	};
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:960px)');
  const menuItemStyle = {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    margin: '5px 0',
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="div">
            <h2>{city.displayName}</h2>
            <h4>{today}</h4>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <div>
            <h2>
              متبقي حتى صلاة{" "}
              {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ backgroundColor: "black", margin: "20px", opacity: ".3" }} />
      <Grid container spacing={2}>
        {[
          { name: "الفجر", time: timings.Fajr, image: "https://www.teahub.io/photos/full/243-2435429_hazrat-sultan-mosque-kazakhstan.jpg" },
          { name: "الظهر", time: timings.Dhuhr, image: "https://www.thoughtco.com/thmb/c7S0ZaaSnOQDpahUjvML_GIgNUc=/5600x3733/filters:fill(auto,1)/united-arab-emirates--abu-dhabi--sheikh-zayed-grand-mosque-on-cloudy-day-528823395-59935f739abed50010c96277.jpg" },
          { name: "العصر", time: timings.Asr, image: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2021/09/11/DfRIyNVc-sheikh-zayed-grand-mosque.jpg" },
          { name: "المغرب", time: timings.Maghrib, image: "https://dq5r178u4t83b.cloudfront.net/wp-content/uploads/sites/175/2022/02/14154435/5-Blue-Mosque-Sultan-Ahmed-Mosque_thumb.jpg" },
          { name: "العشاء", time: timings.Isha, image: "https://live.staticflickr.com/3425/3217209776_1e9595ced3_b.jpg" }
        ].map((prayer, index) => (
          <Grid item xs={12} sm={6} md={isMediumScreen ? 6 : 2.4} key={index}>
            <Prayer name={prayer.name} time={prayer.time} image={prayer.image} />
          </Grid>
        ))}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <Box sx={{ minWidth: 220, maxWidth: 420 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">المدىنة</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="المدىنة"
              onChange={handleChange}
            >
              {existedCities.map((city) => (
                <MenuItem key={city.apiName} value={city.apiName} style={menuItemStyle}>
                  {city.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </>
  ) 
}
