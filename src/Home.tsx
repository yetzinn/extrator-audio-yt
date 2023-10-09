import { useState, useRef, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axios from 'axios';

interface VideoDetails {
    title: string;
    duration: string;
    thumbnail: string;
}

interface StreamingDetail {
    url: string;
    contentLength: string;
    quality: string;
}

interface ApiData {
    videoDetails: VideoDetails;
    streamingDetails: StreamingDetail[];
}

const LoadingComponent = () => {
    return (
        <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin w-11 text-white" />
            <div className="text-white font-bold text-base">Carregando...</div>
        </div>
    );
};

const Home = () => {
    const [url, setUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [isData, setIsData] = useState<ApiData | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isData && isData.videoDetails) {
            if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [isData]);

    const handleSearchVideo = async () => {
        setIsData(null);
        setIsFetching(true);
        try {
            const response = await axios.get(
                `https://danilomodz-youtube-data-extractor-api.onrender.com/?url=${url}`,
                {
                    timeout: 1000 * 20,
                }
            );
            const data: ApiData = response.data.data;
            toast.success('Vídeo extraído com sucesso!');
            setIsData(data);
        } catch (error) {
            toast.error('Erro ao extrair o vídeo!');
            setIsData(null);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-8 md:py-28">
            <div className="max-w-screen-lg m-auto flex flex-col items-center">
                <h1 className="text-white font-bold text-2xl md:text-5xl text-center mb-6 md:mb-10">
                    Maneira simples e sem anúncios para baixar áudio de vídeos
                    do YouTube!
                </h1>
                <div className="flex flex-col gap-4 justify-center items-center w-full md:w-96 p-4">
                    <input
                        type="text"
                        name="url"
                        value={url}
                        placeholder="Insira o link do vídeo aqui"
                        className="bg-slate-700 text-gray-400 w-full px-6 py-4 text-center outline-none border border-slate-500 rounded-full font-bold"
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        onClick={handleSearchVideo}
                        className="bg-blue-500 text-white p-3 rounded-full font-bold hover:bg-blue-700 transition-all duration-500 ease-in-out"
                        disabled={isFetching}
                    >
                        {isFetching ? <LoadingComponent /> : 'Extrair'}
                    </button>
                </div>

                <div className="flex justify-center mt-6 md:mt-10 p-3">
                    {isData && isData.videoDetails && (
                        <div
                            className="flex flex-col gap-5 bg-slate-800 items-center justify-center w-full md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] border border-slate-600 rounded-xl py-6 md:py-11 px-6 md:px-12 lg:px-20"
                            data-aos="zoom-in"
                            id="result"
                            ref={resultRef}
                        >
                            {isData.videoDetails.thumbnail && (
                                <img
                                    src={isData.videoDetails.thumbnail}
                                    className="w-full md:w-[470px] lg:w-[600px] rounded-2xl"
                                    alt="Thumbnail"
                                />
                            )}
                            <p className="text-gray-300 text-xl text-center font-bold max-w-[442px]">
                                {isData.videoDetails.title}
                            </p>
                            <p className="text-center text-gray-300 font-bold text-lg">
                                Tamanho:{' '}
                                {isData.streamingDetails[0].contentLength}
                            </p>
                            {isData.streamingDetails.length > 0 && (
                                <div className="relative mt-[-55px]">
                                    <video controls>
                                        <source
                                            src={isData.streamingDetails[0].url}
                                            type="video/mp4"
                                        />
                                    </video>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-white text-center text-base md:text-lg font-bold mt-6 md:mt-8">
                    Feito com 💙 por{' '}
                    <a
                        href="https://github.com/yetzinn"
                        className="hover:text-blue-700 transition-colors duration-300 ease-in"
                        target="_blank"
                        rel="noopener noreferrer"
                        key="lucas"
                    >
                        Lucas{' '}
                    </a>
                    e{' '}
                    <a
                        href="https://beacons.ai/danilomodz"
                        className="hover:text-blue-700 transition-colors duration-300 ease-in"
                        target="_blank"
                        rel="noopener noreferrer"
                        key="danilo"
                    >
                        Danilo
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Home;
