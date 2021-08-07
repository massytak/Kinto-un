import React, { Component } from "react";
import Comment from "./reviews/Comment";
import { detailofGame } from "./game-service";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { deleteGame } from "./game-service";
import "../../Styling/detailsGame.css";
class DetailsGame extends Component {
  state = {
    game: false,
    id: this.props.match.params.id,
    admin: this.props.userInSession?.admin,
    err: null,
  };

  componentDidMount() {
    detailofGame(this.state.id)
      .then((game) => {
        this.setState({ game: game });
      })
      .catch((err) => console.log("err lors du chargement", err));
  }
  deleteGameInOurDB = (id) => {
    console.log("id du jeux", id);
    deleteGame(id)
      .then((response) => {
        this.props.history.push("/games");
      })
      .catch((error) => {
        this.setState({ err: error.response.data.message });
        setTimeout(() => {
          this.setState({
            err: null,
          });
        }, 3000);
      });
  };
  render(props) {
    return (
      (!this.state.game && <h1>Loading...</h1>) || (
        <div className="single-game">
          <div style={styles.container}>
            <ReactPlayer url={this.state.game.trailer} playing loop />

            <img src={this.state.game.thumbnail} alt="game" />
            <h3>{this.state.game.title}</h3>
            <p>{this.state.game.description}</p>
            <Link
              to={{ pathname: `${this.state.game.game_url}` }}
              target="_blank"
            >
              <button style={styles.button}>Jouer</button>
            </Link>
            <button style={styles.button}>Ajouter/Supprimer aux favoris</button>
            {this.state.admin && (
              <>
                <button
                  style={styles.button}
                  onClick={() => {
                    this.deleteGameInOurDB(this.state.id);
                  }}
                >
                  Supprimer
                </button>
                <Link to={{ pathname: `/games/edit/${this.state.id}` }}>
                  <button style={styles.button}>Modifier</button>
                </Link>
              </>
            )}

            <h3>Information additionnelles</h3>
            <div>
              <p>Développeur:</p>
              <p>{this.state.game.developer}</p>
              <p>Éditeur</p>
              <p>{this.state.game.publisher}</p>
              <p>Plateforme:</p>
              <p>{this.state.game.platform}</p>
              <p>Date de sortie:</p>
              <p>{this.state.game.release_date}</p>
              <p>Catégorie:</p>
              <p>{this.state.game.genre}</p>
              <div>
                {this.state.game.screenshots.map((scrennShoot, i) => {
                  return (
                    <div key={scrennShoot.id}>
                      <img src={scrennShoot.image} alt="screen" />
                    </div>
                  );
                })}
              </div>
              <h3>Configuration minimale requise</h3>
              <div>
                <p>OS:</p>
                <p>{this.state.game.minimum_system_requirements.os}</p>
                <p>Processeur:</p>
                <p>{this.state.game.minimum_system_requirements.processor}</p>
                <p>Stockage:</p>
                <p>{this.state.game.minimum_system_requirements.storage}</p>
                <p>Mémoire:</p>
                <p>{this.state.game.minimum_system_requirements.memory}</p>
                <p>Graphique:</p>
                <p>{this.state.game.minimum_system_requirements.graphics}</p>
              </div>
            </div>
          </div>
          <div>
            <Comment {...this.props} />
            {this.state.game.reviews.map((review, i) => {
              return (
                <div key={review._id}>
                  <img src={review.user.image} alt="avatar user" />
                  <p>{review.user.username}</p>
                  <ReactStars
                    activeColor="#00FF00"
                    size={100}
                    value={review.note}
                    edit={false}
                  />
                  <p>{review.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    height: "50px",
    width: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    backgroundColor: "#212529",
    fontSize: "14px",
    lineHeight: "1.125",
    borderRadius: "5px",
    padding: "2px 5px",
    cursor: "pointer",
  },
};

export default DetailsGame;