/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../../styles/GallerySection.module.css'
import Image from 'next/image'
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/pagination';
import {getFilePath} from  '../../components/ConfigureProduct';
import { Navigation, Thumbs,FreeMode,Mousewheel,Zoom,Pagination } from 'swiper/modules';


function GallerySection({currentVariantData,setSchemaImage }: any) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
   
    const [currentVariantion, setCurrentVariantion] = useState<any>(null);
  
  
    useEffect(() => {
        if(currentVariantData.videos){
          updateVideoThubnail()
        }else{
          setCurrentVariantion(currentVariantData)
        }
    },[currentVariantData]);

    
    useEffect(()=>{
      if(currentVariantion){
        setSchemaImage( currentVariantion?.media_gallery?.[0]?.url.replace(/\/cache\/.*?\//, "/"))
      }
  
    },[currentVariantion])
    

  const updateVideoThubnail=async()=>{
    
    let videosList = [];
    const videoPromises = currentVariantData.videos.map(async (video:any) => {
      let newVideo= { ...video };
      let thumbnail = await generateVideoThumbnail(video.url)
      newVideo['thumbnail'] = thumbnail;
      return newVideo;
    })
    videosList = await Promise.all(videoPromises);
    currentVariantData.videos=videosList
    setCurrentVariantion(currentVariantData)
  }


  const handelThumbClick = useCallback((divId:any) => {
    const bgVideosList= document.querySelectorAll(".product_video");
        bgVideosList.forEach((videoItem:any)=>{
          if(videoItem){
            videoItem.pause();
            
          }
        })
 
  }, [thumbsSwiper]);

  const handelVideoThumbClick = useCallback((divId:any) => {
    let video:any = document.getElementById('video_player_'+divId);
    if(video){
      var videooverlayplay:any = document.getElementById('video_overlay_play_'+divId);
      var videooverlaypause:any = document.getElementById('video_overlay_pause_'+divId);
          video.play();
          videooverlaypause.style.display='none';
          videooverlayplay.style.display='none'
     
  }
    
  }, [thumbsSwiper]);
  
 

const generateVideoThumbnail = (file:any) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    // this is important
    const video = document.createElement('video');
    video.setAttribute('src', file);
    video.setAttribute('crossorigin', "anonymous");
    video.load();
    video.currentTime = 1;
    video.onloadeddata = () => {
      let ctx:any = canvas.getContext("2d");

      canvas.width = 500;
      canvas.height = 500;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
};
    

function VideoMouseOut(divId:any){
  let video:any = document.getElementById('video_player_'+divId);
  
  if(video){
      let videooverlayplay:any = document.getElementById('video_overlay_play_'+divId);
      let videooverlaypause:any = document.getElementById('video_overlay_pause_'+divId);
      if(video.paused){
          videooverlayplay.style.display='flex'
      }else{
          videooverlaypause.style.display='none'
          videooverlayplay.style.display='none'
      }
     
  }

}

function VideoMouseOver(divId:any){
  var video:any = document.getElementById('video_player_'+divId);
  if(video){
      var videooverlayplay:any = document.getElementById('video_overlay_play_'+divId);
      var videooverlaypause:any = document.getElementById('video_overlay_pause_'+divId);
      if(video.paused){
          videooverlayplay.style.display='flex'
          videooverlaypause.style.display='none'
      }else{
          videooverlaypause.style.display='flex'
          videooverlayplay.style.display='none'
      }
     
  }

}

function PauseVideo(divId:any){
  
  var video:any = document.getElementById('video_player_'+divId);
  if(video){
      var videooverlayplay:any = document.getElementById('video_overlay_play_'+divId);
      var videooverlaypause:any = document.getElementById('video_overlay_pause_'+divId);
      
      if(video.paused){
          video.play();
          videooverlayplay.style.display='none'
          videooverlaypause.style.display='flex';
      }else{
          video.pause();
          videooverlaypause.style.display='none';
          videooverlayplay.style.display='flex'
      }
     
  }

}

function imageZoom(imgID:any, resultID:any) {
  var img:any, lens:any, result:any, cx:any, cy:any;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /*create lens:*/
  lens = document.getElementById(imgID+'_lens');
 // lens.setAttribute("class", "img-zoom-lens");
  /*insert lens:*/
  //img.parentElement.insertBefore(lens, img);
  /*calculate the ratio between result DIV and lens:*/
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /*set background properties for the result DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')";
 // result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
  /*execute a function when someone moves the cursor over the image, or the lens:*/
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  /*and also for touch screens:*/
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);
  function moveLens(e:any) {
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image:*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    /*calculate the position of the lens:*/
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    /*prevent the lens from being positioned outside the image:*/
    if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
    if (x < 0) {x = 0;}
    if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
    if (y < 0) {y = 0;}
    /*set the position of the lens:*/
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /*display what the lens "sees":*/
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }
  function getCursorPos(e:any) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}

const onMooiseOvver=(myimage:any)=>{
  let result:any = document.getElementById('myresult');
  let lens:any = document.getElementById(myimage+'_lens');
  result.classList.add('activediv');
  lens.classList.add('activediv');
  imageZoom(myimage, "myresult");
}

const onMooiseOut=(myimage:any)=>{
  let result:any = document.getElementById('myresult');
  let lens:any = document.getElementById(myimage+'_lens');
  result.classList.remove('activediv');
  lens.classList.remove('activediv');
}


  return (
    <div className={styles.gallerysection}>
       

        <div className={styles.gallerysectionLeft}>
        <Swiper
        spaceBetween={10}
        slidesPerView={5}
        modules={[FreeMode, Navigation, Thumbs,Mousewheel]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        className='mySwiper'
        direction={'vertical'}
        navigation={true}
        mousewheel={true}
        autoHeight={false}
      >
        
        {currentVariantion?.media_gallery?.map((gallery:any, i:any)=>(<>
            <SwiperSlide key={'thumb_'+i} onClick={()=>handelThumbClick(i)}>
                <Image
                    src={ getFilePath(gallery.url)}
                    height={100}
                    width={100}
                    alt={currentVariantion.variant_name || 'Gallery Image'}
                    />
                    
            </SwiperSlide>
            </>))}

            {currentVariantion?.videos?.map((video:any, v:any)=>(<>
            <SwiperSlide key={'video_thumb'+v} onClick={()=>handelVideoThumbClick(v)}>
            {video.url && <div className={styles.galleryVideoThumb}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" >
                          <defs> </defs>
                          <circle className={styles.galleryVideoa}  cx="36" cy="36" r="36" />
                          <circle className={styles.galleryVideob}  cx="36" cy="36" r="33.5" />
                          <path d="M29.72,51.83h0l0,0V20l0,0L51,35.91,29.72,51.83Z" transform="translate(0 0)" />
                          </svg>
                  </div>}
                  {video.thumbnail && <Image
                    src={ getFilePath(video.thumbnail)}
                    height={300}
                    width={300}
                    alt={`${currentVariantion.variant_name} Thumbnail`}
                    />}
                    
            </SwiperSlide>
            
            </>))}

        </Swiper>

      
        </div>
        <div className={styles.gallerysectionRight}>
        <Swiper
        zoom={true}
        spaceBetween={0}
        navigation={false}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
      modules={[Zoom,FreeMode, Navigation, Thumbs,Pagination]}
      autoHeight={true}
      pagination={true}
      
    >
       
       {currentVariantion?.media_gallery?.map((gallery:any, i:any)=>(<>
            
            <SwiperSlide key={'main_'+i} data-hash={'slide'+i} >
                <div className="swiper-zoom-container">
                
                  <Image
                    src={ getFilePath(gallery.url)}
                    height={1000}
                    width={1000}
                    alt={currentVariantion.variant_name}
                    id={'main_'+i}
                    
                    />
                    <div id={'main_'+i+'_lens'} className="img-zoom-lens"></div>
                </div>
                
            </SwiperSlide>
      </>))}

        {currentVariantion?.videos?.map((video:any, v:any)=>(<>
            <SwiperSlide key={'video_'+v} data-hash={'video'+v}>
            {video.url && <div id={"video_overlay_play_"+v} className={styles.galleryVideo} onClick={()=>PauseVideo(v)} onMouseLeave={()=>VideoMouseOut(v)} onMouseEnter={()=>VideoMouseOver(v)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" >
                          <defs> </defs>
                          <circle className={styles.galleryVideoa}  cx="36" cy="36" r="36" />
                          <circle className={styles.galleryVideob}  cx="36" cy="36" r="33.5" />
                          <path d="M29.72,51.83h0l0,0V20l0,0L51,35.91,29.72,51.83Z" transform="translate(0 0)" />
                          </svg>
                </div>}
                {video.url && <div id={"video_overlay_pause_"+v} className={styles.galleryVideo} onClick={()=>PauseVideo(v)} onMouseLeave={()=>VideoMouseOut(v)} onMouseEnter={()=>VideoMouseOver(v)}>
                          <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
                                        <path id="Layer" className={styles.s0}  d="m36 72c-19.9 0-36-16.1-36-36 0-19.9 16.1-36 36-36 19.9 0 36 16.1 36 36 0 19.9-16.1 36-36 36z"/>
                                        <path id="Layer" className={styles.s1}  d="m36 69.5c-18.5 0-33.5-15-33.5-33.5 0-18.5 15-33.5 33.5-33.5 18.5 0 33.5 15 33.5 33.5 0 18.5-15 33.5-33.5 33.5z"/>
                                        <path id="Shape 1" className={styles.s2}  d="m25 20h5.3v32h-5.3z"/>
                                        <path id="Shape 1 copy" className={styles.s2}  d="m41 20h5.3v32h-5.3z"/>
                          </svg>
                                        
                </div>}
                {video.url && <video controls className='product_video' loop id={"video_player_"+v} autoPlay onMouseLeave={()=>VideoMouseOut(v)} onMouseEnter={()=>VideoMouseOver(v)}>
                    {video.url.indexOf('mp4') != -1 ?<source src={getFilePath(video.url)} type="video/mp4" />:<source src={getFilePath(video.url)} type="video/ogg" />}
                    </video>}
                
            </SwiperSlide>
</>))}

    </Swiper>
        </div>
     
   
    
   
        <div id="myresult" className="img-zoom-result"></div>
    </div>
  )
}

export default GallerySection


