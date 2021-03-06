import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useWindowDimensions from '../Hooks/useWindowDimension';
import Playbar from '../components/playbar/Playbar';
import Header from '../components/header/header.jsx';
import SideBar from '../components/sideBar/sideBar';
import Contact from '../components/Contact/Contact';
import Carousel from '../components/Carousel/Carousel';
import Player from '../components/Player/Player';
import PlaylistSwitch from '../components/Playlist/PlaylistSwitch';
import SliderAlbum from '../components/Slider/SliderAlbum';
import SliderArtist from '../components/Artist-Slider/SliderArtist';
import bg from '../img/BackGrounds/BackGround1.webp';
import PlayerMobile from '../components/PlayerMobile/PlayerMobile';
import authContext from '../context/authContext';
import { useHistory } from 'react-router';
import AdminPannel from '../components/AdminPannel/AdminPannel';
import MyPlaylist from '../components/MyPlaylist/MyPlaylist';
import '../components/Carousel/scrollbarwebkit.css';

function App() {
  const [isRecentAddsActive, setIsRecentAddsActive] = useState(true);
  const [isSideBarVisible, setisSideBarVisible] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isMobilePlayerVisible, setIsMobilePlayerVisible] = useState(true);
  const { width } = useWindowDimensions();
  const [item, setItem] = useState([]);
  const [audio, setAudio] = useState(false);
  const [onListen, setOnListen] = useState();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState();
  const [album, setAlbum] = useState();
  const [picture, setPicture] = useState();
  const [isPlaySwitch, setIsPlaySwitch] = useState(true);
  const [sideBarClass, setSideBarClass] = useState(
    'overflow-y-auto flex h-screen w-3/12 fixed right-0 flex-col  900:col-start-4 900:col-end-5 900:row-start-1 900:row-span-6 bg-bgPlaybar  shadow-playbar',
  );
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedSong, setSelectedSong] = useState();
  const [isAlbum, setIsAlbum] = useState(false);
  const [isArtist, setIsArtist] = useState(true);
  const [onSearch, setOnSearch] = useState();
  const { token } = useContext(authContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();
  const [isAlbumTrackList, setIsAlBumTrackList] = useState(false);
  const [isArtistTrackList, setIsArtistTrackList] = useState(false);
  const [playLists, setPlayLists] = useState([]);
  const [myPlaylist, setMyPlaylist] = useState(localStorage.getItem('myPlaylist') ? JSON.parse(localStorage.getItem('myPlaylist')) : []);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [popup, setPopup] = useState(false);
  useEffect(() => {
    if (!token) {
      history.push('/');
    }
  }, [token]);

  const getDatas = async () => {
    const [resSongs, resArtists, resAlbums, resPlayLists] = await Promise.all([
      axios.get('http://185.98.138.13:4000/api/v1/songs', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://185.98.138.13:4000/api/v1/artists', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://185.98.138.13:4000/api/v1/albums', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://185.98.138.13:4000/api/v1/playlists', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setItem(resSongs.data);
    setAlbums(resAlbums.data);
    setArtists(resArtists.data);
    setPlayLists(resPlayLists.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    getDatas();
  }, [popup]);

  useEffect(() => {
    if (!isLoading) {
      setOnListen(item[0].s3_link);
      setTitle(item[0].title);
      setAlbum(item[0].album.title);
      setPicture(item[0].album.picture);
      setArtist(item[0].artist.name);
    }
  }, [isLoading]);

  useEffect(() => {
    setIsAlbum(false);
    setIsArtist(false);
  }, [currentTrack]);

  useEffect(() => {
    if (width < 768) {
      setisSideBarVisible(false);
      setIsMobilePlayerVisible(true);
    } else {
      setisSideBarVisible(true);
      setIsMobilePlayerVisible(false);
      setIsPlayerVisible(false);
    }
  }, [width]);

  const hideAdmin = () => {
    setIsAdmin(false);
    getDatas()
  };

  const handleSong = () => {
    setOnListen(item[currentTrack].s3_link);
  };
  const handleSideBar = () => {
    isSideBarVisible ? setisSideBarVisible(false) : setisSideBarVisible(true);
    isSideBarVisible
      ? setSideBarClass(
          'flex fixed  h-screen  flex-col  900:col-start-5 900:col-end-6 900:row-start-1 900:row-span-6 bg-bgPlaybar shadow-playbar overflow-y-auto',
        )
      : setSideBarClass(
          'flex fixed z-50 flex-col h-screen w-screen  top-0 right-0 900:col-start-4 900:col-end-5 900:row-start-1 900:row-span-6 bg-bgPlaybar  shadow-playbar overflow-y-auto',
        );
  };
  const handleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      
      setIsAdmin(true);
    }
  };

  return (
    <div
      className="flex align-middle justify-center pb-24"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}>
      {isAdmin && <AdminPannel getDatas={getDatas} playLists={playLists} artists={artists} hideAdmin={hideAdmin} item={item} token={token} albums={albums} />}

      <div className="grid mx-5 gap-5  900:gap-6 grid-cols-mobile grid-rows-mobile 900:grid-cols-desktop 900:ml-6 900:mr-0 900:grid-rows-desktop">
        <Header handleSideBar={handleSideBar} setOnSearch={setOnSearch} isSideBarVisible={isSideBarVisible} />
        <div className="col-start-1 col-end-3 row-start-2 900:col-end-4 rounded-20 bg-black bg-opacity-10 shadow-layoutContainer overflow-x-auto">
          {/* The Main Component GoHere */}
          {!isLoading && (
            <Carousel
              isRecentAddsActive={isRecentAddsActive}
              setIsRecentAddsActive={setIsRecentAddsActive}
              setSelectedSong={setSelectedSong}
              setIsAlBumTrackList={setIsAlBumTrackList}
              setIsArtistTrackList={setIsArtistTrackList}
              setCurrentTrack={setCurrentTrack}
              isAlbumTrackList={isAlbumTrackList}
              isArtistTrackList={isArtistTrackList}
              onSearch={onSearch}
              item={item}
              albums={albums}
              artists={artists}
              setMyPlaylist={setMyPlaylist}
              isPlaylist={isPlaylist}
              setIsPlaylist={setIsPlaylist}
            />
          )}
        </div>
        <div className=" overflow-y-auto sidebar col-start-1 col-end-3 row-start-3 row-end-4 900:col-end-2 900:row-end-5 rounded-20 bg-black bg-opacity-20 shadow-layoutContainer">
          {!isLoading && (
            <PlaylistSwitch
              setSelectedSong={setSelectedSong}
              playLists={playLists}
              item={item}
              setCurrentTrack={setCurrentTrack}
              currentTrack={currentTrack}
              setAddPlaylist={setMyPlaylist}
            />
          )}
          {/* />*/}
        </div>
        <div className="overflow-hidden col-start-1 col-end-2 row-start-4 row-end-5 gap-x-1 900:col-start-2 900:col-end-3 900:row-start-3 900:row-end-4  rounded-20 bg-black bg-opacity-20 shadow-layoutContainer">
          {!isLoading && (
            <SliderArtist
              setIsArtist={setIsArtist}
              setSelectedSong={setSelectedSong}
              item={item}
              artists={artists}
              setCurrentTrack={setCurrentTrack}
              isArtist={isArtist}
            />
          )}
        </div>
        <div className="overflow-hidden col-start-2 col-end-3 row-start-4 rows-end-5 900:col-start-3 900:col-end-4 900:row-start-3 900:row-end-4 rounded-20 gap-x-1 bg-black bg-opacity-20 shadow-layoutContainer">
          {!isLoading && (
            <SliderAlbum
              setIsAlbum={setIsAlbum}
              setSelectedSong={setSelectedSong}
              item={item}
              albums={albums}
              setCurrentTrack={setCurrentTrack}
              isAlbum={isAlbum}
            />
          )}
        </div>
        <div className="col-start-1 col-end-3 row-start-5 row-end-6 rounded-20 900:col-start-2 900:col-end-4 900:row-start-4 900:row-end-5 bg-black bg-opacity-20 shadow-layoutContainer">
          {myPlaylist && (
            <MyPlaylist
              myPlaylist={myPlaylist}
              setMyPlaylist={setMyPlaylist}
              setIsPlaylist={setIsPlaylist}
              setSelectedSong={setSelectedSong}
              item={item}
              setOnListen={setOnListen}
              setCurrentTrack={setCurrentTrack}
            />
          )}
        </div>

        <div className="col-start-1 col-end-3 row-start-6 row-end-7 rounded-20 900:col-end-4 900:row-start-5 900:row-end-6 bg-black bg-opacity-20 shadow-layoutContainer mb-4">
          <Contact />
        </div>
        {isSideBarVisible && (
          <SideBar
            playLists={playLists}
            handleAdmin={handleAdmin}
            sideBarClass={sideBarClass}
            albums={albums}
            setSideBarClass={setSideBarClass}
            handleSideBar={handleSideBar}
            popup={popup}
            setPopup={setPopup}
            getDatas={getDatas}
          />
        )}
      </div>
      {!isLoading && isMobilePlayerVisible ? (
        <PlayerMobile
          onListen={onListen}
          audio={audio}
          currentTrack={currentTrack}
          handleSong={handleSong}
          item={item}
          title={title}
          album={album}
          artist={artist}
          picture={picture}
          setAudio={setAudio}
          setOnListen={setOnListen}
          setCurrentTrack={setCurrentTrack}
          setAlbum={setAlbum}
          setTitle={setTitle}
          setArtist={setArtist}
          setPicture={setPicture}
          setIsPlayerVisible={setIsPlayerVisible}
          setIsMobilePlayerVisible={setIsMobilePlayerVisible}
          isPlaySwitch={isPlaySwitch}
          setIsPlaySwitch={setIsPlaySwitch}
          selectedSong={selectedSong}
          isAlbum={isAlbum}
          isArtist={isArtist}
          isArtistTrackList={isArtistTrackList}
          isAlbumTrackList={isAlbumTrackList}
          isPlaylist={isPlaylist}
          myPlaylist={myPlaylist}
          isRecentAddsActive={isRecentAddsActive}
          setSelectedSong={setSelectedSong}
        />
      ) : (
        ''
      )}
      {!isLoading && width > 900 ? (
        <Playbar
          isRecentAddsActive={isRecentAddsActive}
          isAlbumTrackList={isAlbumTrackList}
          isArtistTrackList={isArtistTrackList}
          onListen={onListen}
          audio={audio}
          currentTrack={currentTrack}
          handleSong={handleSong}
          item={item}
          title={title}
          album={album}
          artist={artist}
          picture={picture}
          setAudio={setAudio}
          setOnListen={setOnListen}
          setCurrentTrack={setCurrentTrack}
          setAlbum={setAlbum}
          setTitle={setTitle}
          setArtist={setArtist}
          setPicture={setPicture}
          albums={albums}
          setIsMobilePlayerVisible={setIsMobilePlayerVisible}
          isPlaySwitch={isPlaySwitch}
          setIsPlaySwitch={setIsPlaySwitch}
          selectedSong={selectedSong}
          isAlbum={isAlbum}
          isArtist={isArtist}
          isPlaylist={isPlaylist}
          myPlaylist={myPlaylist}
          setSelectedSong={setSelectedSong}
        />
      ) : (
        ''
      )}
      {!isLoading && isPlayerVisible ? (
        <Player
          item={item}
          title={title}
          album={album}
          artist={artist}
          picture={picture}
          setAudio={setAudio}
          setOnListen={setOnListen}
          setCurrentTrack={setCurrentTrack}
          setAlbum={setAlbum}
          setTitle={setTitle}
          setArtist={setArtist}
          setPicture={setPicture}
          audio={audio}
          currentTrack={currentTrack}
          onListen={onListen}
          setIsPlayerVisible={setIsPlayerVisible}
          setIsMobilePlayerVisible={setIsMobilePlayerVisible}
          isPlaySwitch={isPlaySwitch}
          setIsPlaySwitch={setIsPlaySwitch}
          selectedSong={selectedSong}
          isAlbum={isAlbum}
          isArtistTrackList={isArtistTrackList}
          isArtist={isArtist}
          isAlbumTrackList={isAlbumTrackList}
          isPlaylist={isPlaylist}
          myPlaylist={myPlaylist}
          isRecentAddsActive={isRecentAddsActive}
          setSelectedSong={setSelectedSong}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
