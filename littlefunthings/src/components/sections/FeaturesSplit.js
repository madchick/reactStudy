import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: `madchick's little fun things`,
    paragraph: 'funny sites i wrote or got from github, youtube and what a great whole internet world'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>

            <div className="split-item">              
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  AI, deep learning
                </div>
                <h3 className="mt-0 mb-12">
                  AI face-comparison
                </h3>
                <p className="m-0">
                  Using Google Teachable Machine, find out which animal face looks like mine, and Korean K-pop or movie starts
                  <br></br><br></br><a href="https://www.youtube.com/watch?v=ZTJjW7XuHIY&list=PLU9-uwewPMe2-vtJAgWB6SNhHcTjJDgEO" target="jocodingyoutube">got it from JoCoding's youtube</a>
                  <br></br><a href="https://littlefunthings.netlify.app/animalface" target="animalface">go to see</a>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-01.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  OpenAPI, Open Street Map
                  </div>
                <h3 className="mt-0 mb-12">
                  Drawing street map you want
                  </h3>
                <p className="m-0">
                Render every single road in any city at once. You can save street map in png image file.
                  <br></br><br></br><a href="https://github.com/anvaka/city-roads" target="anvakacityroads">got it from anvaka's github</a>
                  <br></br><a href="https://littlefunthings.netlify.app/cityroads" target="cityroads">go to see</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-02.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  OpenCV, Javascript, Web Assembly
                  </div>
                <h3 className="mt-0 mb-12">
                  Make gif animation from video
                  </h3>
                <p className="m-0">
                  Build a web app the converts video to animated GIF with Web Assembly. It's not working on your smart phone, it works on PC web browser only. you can get animated gif with one click
                  <br></br><br></br><a href="https://fireship.io/lessons/wasm-video-to-gif" target="fireshipio">got it from fireship.io</a>
                  <br></br><a href="https://littlefunthings.netlify.app/gifmaker" target="gifmaker">go to see</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-03.png')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  HTML, CSS, Javascript
                  </div>
                <h3 className="mt-0 mb-12">
                  Fortune telling
                  </h3>
                <p className="m-0">
                  Let's find out your fortune in year of 2021.
                  <br></br><br></br><a href="https://spartacodingclub.kr/online/seasonal" target="spartacodingclub">got it from sparta coding club</a>
                  <br></br><a href="https://littlefunthings.netlify.app/luckynewyear" target="luckynewyear">go to see</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-04.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>            

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  ReactJS, OpenAPI
                  </div>
                <h3 className="mt-0 mb-12">
                  Movie App
                  </h3>
                <p className="m-0">
                  Find famous movie and info.
                  <br></br><br></br><a href="https://nomadcoders.co/react-fundamentals" target="nomadcoders1">got it from nomad coders</a>
                  <br></br><a href="https://littlefunthings.netlify.app/movie" target="movie">go to see</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-05.png')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  React Native, OpenAPI
                  </div>
                <h3 className="mt-0 mb-12">
                  Movie, TV Show App
                  </h3>
                <p className="m-0">
                  Find famous movies and TV shows. You can search, get movies and TV shows info.
                  <br></br><br></br><a href="https://nomadcoders.co/react-native-for-beginners" target="nomadcoders2">got it from nomad coders</a>
                  <br></br><a href="https://littlefunthings.netlify.app/nomflix" target="nomflix">go to see</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-06.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>       

          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;



