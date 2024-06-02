import React, { Component } from 'react';
import axios from "axios";

class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
        };
    }

    componentDidMount() {
        const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
        const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=funny&limit=25&offset=0`;

        axios.get(apiUrl)
            .then(response => {
                this.setState({ data: response.data.data });
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    }
    handleGifClick = (url) => {
        const userConfirmed = window.confirm("Do you want to download this GIF?");
        if (userConfirmed) {
            this.downloadGif(url);
        }
    }

    downloadGif = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded-gif.gif';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading the GIF:', error);
        }
    }

    render() {
        return (
            <div className="container">
                <header className="header-main">
                    <h1>Gif Free</h1>
                </header>
                <main className="content-grid">
                    {this.state.error === null ? (
                        this.state.data.map((item, index) => (
                            <div key={index} className="grid-item" onClick={() => this.handleGifClick(item.images.fixed_height.url)}>
                                <img src={item.images.fixed_height.url} alt={item.title} />
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>{this.state.error}</p>
                        </div>
                    )}
                </main>
            </div>
        );
    }
}

export default MainComponent;
