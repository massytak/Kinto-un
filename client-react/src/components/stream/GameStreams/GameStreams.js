import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { gamesTwitch } from "../stream-service";
import { getStreamer } from "../stream-service";
function GameStreams() {
  let { slug } = useParams();
  let location = useLocation();
  // console.log(location);

  const [streamData, setStreamData] = useState([]);
  const [viewers, setViewers] = useState(0);
  useEffect(() => {
    // const fetchData = async () => {
    // const result = await api.get(`https://api.twitch.tv/helix/streams?game_id=${location.state.gameID}`);

    gamesTwitch(location.state.gameID)
      .then((result) => {
        let dataArray = result.data;
        let finalArray = dataArray.map((stream) => {
          let newUrl = stream.thumbnail_url
            .replace("{width}", "320")
            .replace("{height}", "180");
          stream.thumbnail_url = newUrl;
          return stream;
        });

        // calcul du total des viewers
        let totalViewers = finalArray.reduce((acc, val) => {
          return acc + val.viewer_count;
        }, 0);

        let userIDs = dataArray.map((stream) => {
          return stream.user_id;
        });

        let queryParamsUsers = "";

        userIDs.map((id) => {
          return (queryParamsUsers = queryParamsUsers + `id=${id}&`);
        });

        let finalUrl = queryParamsUsers.substr(3);

        getStreamer(finalUrl)
          .then((getUsersLogin) => {
            let userLoginArray = getUsersLogin.data;

            finalArray = dataArray.map((stream) => {
              stream.login = "";
              userLoginArray.forEach((login) => {
                if (stream.user_id === login.id) {
                  stream.login = login.login;
                }
              });
              return stream;
            });
            setViewers(totalViewers);
            setStreamData(finalArray);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    // let dataArray = result.data.data;
    // let finalArray = dataArray.map((stream) => {
    //   let newUrl = stream.thumbnail_url
    //     .replace("{width}", "320")
    //     .replace("{height}", "180");
    //     stream.thumbnail_url = newUrl;
    //   return stream;
    // });

    // // calcul du total des viewers
    // let totalViewers = finalArray.reduce((acc, val) => {
    //   return acc + val.viewer_count;
    // }, 0);

    // let userIDs = dataArray.map((stream) => {
    //   return stream.user_id;
    // });

    // let baseUrl = "https://api.twitch.tv/helix/users?";
    // let queryParamsUsers = "";

    // userIDs.map((id) => {
    //   return (queryParamsUsers = queryParamsUsers + `id=${id}&`);
    // });

    // let finalUrl = baseUrl + queryParamsUsers;

    // let getUsersLogin = await api.get(finalUrl);

    // let userLoginArray = getUsersLogin.data.data;

    // finalArray = dataArray.map((stream) => {
    //   stream.login = "";
    //   userLoginArray.forEach((login) => {
    //     if (stream.user_id === login.id) {
    //       stream.login = login.login;
    //     }
    //   })
    //   return stream;
    // })
    // setViewers(totalViewers);
    // setStreamData(finalArray);
    // }

    //   fetchData();
    // }, [location.state.gameID]);
  });
  // console.log(viewers);
  // console.log(streamData);

  return (
    <div>
      <Sidebar />

      <h1 className="titreGamesStreams">Streams : {slug}</h1>
      <h3 className="sousTitreGameStreams">
        <strong className="textColored">{viewers}</strong> personnes regardent{" "}
        {slug}
      </h3>
      <div className="flexAccueil">
        {streamData.map((stream, index) => (
          <div key={index} className="carteGameStreams">
            <img
              src={stream.thumbnail_url}
              alt="jeu carte img"
              className="imgCarte"
            />
            <div className="cardBodyGameStreams">
              <h5 className="titreCartesStream">{stream.user_name}</h5>
              <p className="txtStream">
                Nombre de viewers : {stream.viewer_count}
              </p>
              <Link
                className="lien"
                to={{
                  pathname: `/stream/live/${stream.login}`,
                }}
              >
                <div className="btnCarte">Regarder : {stream.user_name}</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameStreams;
