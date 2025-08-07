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
    title: `little fun things`,
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
                  Korean study
                </div>
                <h3 className="mt-0 mb-12">
                  K-Drama & K-Movie favorite lines and quotes - Listen and speak, memorize in Korean
                </h3>
                <p className="m-0">
                  Listening and speaking practice in Korean with K-drama lines and quotes. Powered by Kakao AI speach API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/koreanstudy" target="koreanstudy">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.kdramaquotes" target="_blank"><Image src={require('../koreanstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/kr/app/id1626721188" target="_blank"><Image src={require('../koreanstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-07.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  English Study
                  </div>
                <h3 className="mt-0 mb-12">
                  Dear Abby - 영어 기사 무료 듣기 (리스닝 연습)
                  </h3>
                <p className="m-0">
                  English listening practice with Dear Abby articles. Powered by google AI Text-to-Speech API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/englishstudy" target="englishstudy">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.dailyenglish" target="_blank"><Image src={require('../englishstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/us/app/id6503616543" target="_blank"><Image src={require('../englishstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-08.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">              
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Korean study
                </div>
                <h3 className="mt-0 mb-12">
                  Korean movie favorite lines and quotes
                </h3>
                <p className="m-0">
                  Listening and speaking practice in Korean with Korean movie lines and quotes. Powered by Kakao AI speach API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/moviekorean" target="moviekorean">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.kdramaquotes" target="_blank"><Image src={require('../koreanstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/kr/app/id1626721188" target="_blank"><Image src={require('../koreanstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-11.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">              
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  English Study
                </div>
                <h3 className="mt-0 mb-12">
                  Awesome English expressions from TV series, best quotes, lines
                </h3>
                <p className="m-0">
                  English listening practice with TV series. Powered by google AI Text-to-Speech API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/tvseriesenglish" target="tvseriesenglish">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.dailyenglish" target="_blank"><Image src={require('../englishstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/us/app/id6503616543" target="_blank"><Image src={require('../englishstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-12.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">              
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  English Study
                </div>
                <h3 className="mt-0 mb-12">
                  English quotes from movies
                </h3>
                <p className="m-0">
                  English listening practice with movies. Powered by google AI Text-to-Speech API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/movieenglish" target="movieenglish">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.dailyenglish" target="_blank"><Image src={require('../englishstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/us/app/id6503616543" target="_blank"><Image src={require('../englishstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-13.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">              
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  English Study
                </div>
                <h3 className="mt-0 mb-12">
                  English everyday conversation examples, lines, sentences
                </h3>
                <p className="m-0">
                  English listening practice with everyday conversation examples. Powered by google AI Text-to-Speech API.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/englishconv" target="englishconv">go to see live demo</a>
                </p>
                <p className="m-0">
<center>
<br/><br/>
<a href="https://play.google.com/store/apps/details?id=com.pseudosoft21.dailyenglish" target="_blank"><Image src={require('../englishstudy/images/googleplay.png')} width={200}/></a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://apps.apple.com/us/app/id6503616543" target="_blank"><Image src={require('../englishstudy/images/appleappstore.png')} width={200}/></a>
</center>
                </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-14.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

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
                  <br></br><a href="https://littlefunthings.netlify.app/animalface" target="animalface">go to see live demo</a>
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
                  <br></br><a href="https://littlefunthings.netlify.app/cityroads" target="cityroads">go to see live demo</a>
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
                  <br></br><a href="https://littlefunthings.netlify.app/nomflix" target="nomflix">go to see live demo</a>
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

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Javascript
                  </div>
                <h3 className="mt-0 mb-12">
                  Wordle game clone
                  </h3>
                <p className="m-0">
                  Wordle game clone using javascript only.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/wordle" target="wordle">go to see live demo</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-10.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>                                   

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Javascript, Google Calendar API
                  </div>
                <h3 className="mt-0 mb-12">
                  World holiday list
                  </h3>
                <p className="m-0">
                  Show holiday list of this year for some countries.
                  <br></br><br></br><a href="https://littlefunthings.netlify.app/holidaylist" target="holidaylist">go to see live demo</a>
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-09.png')}
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



