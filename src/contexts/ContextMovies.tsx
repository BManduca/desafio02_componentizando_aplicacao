import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";


interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface ContextMoviesData {
  genres: GenreResponseProps[];
  selectedGenre: GenreResponseProps;
  selectedGenreId: number;
  setSelectedGenreId: React.Dispatch<number>;
  movies: MovieProps[];
}

interface MoviesProviderProps {
  //ReactNode aceita qualquer tipo de conteúdo valido para o react
  //ou seja, aceita uma tag HTML, jsx, aceita texto diretamente...
  children: ReactNode;
}

export const ContextMovies = createContext({} as ContextMoviesData)

export function MoviesProvider({ children }: MoviesProviderProps) {
  /*
    Para cada campo existente hoje na aplicação, foi efetuado
    a desestrutração do mesmo e através do useState foi aplicado
    a inicialização de cada input
   */
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  //para não ocorrer erro, vamos forçar uma tipagem no JS, 
  //forçando o formato da seguinte forma -> {} as GenreResponseProps
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [movies, setMovies] = useState<MovieProps[]>([]);

  /* Chamadas de resposta através do response, para
  trazer os dados armazenados na API da aplicação e que será 
  mostrado em tela */
  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  return (
    <ContextMovies.Provider value={{
      genres,
      selectedGenre,
      selectedGenreId,
      setSelectedGenreId,
      movies
    }}>
      { children }
    </ContextMovies.Provider>
  )
}