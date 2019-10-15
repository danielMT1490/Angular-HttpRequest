import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { MessageService } from './message.service';

//importamos el modulo que permite crear peticiones http
import { HttpClient, HttpHeaders } from '@angular/common/http';
//importamos la clase catch para controlar errores
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class HeroService {

  //definimos la url que consumiremos
  private heroesUrl: string = 'api/heroes';
  //creamos una variable donde añadiremos headers
  private httpOptions = 
  {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  constructor
  (
    private messageService: MessageService, 
    private http: HttpClient
  ) { }

  getHeroes(): Observable<Hero[]> {
    //lanzamos una peticion http en este caso un get que devuelve la lista de heroes
    //con pipe anidamos observables en este caso el catchError para una respuesta incorrecta
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe
      (
        //podemos usar el tap para lanzar efectos secundarios dentro el pipe
        tap(()=> this.log('fetched heroes for http request')),
        catchError(this.handleError('getHeroes',[]))
      );
  }

  //funcion para obtener un heroe por su id
  getHero(id: number): Observable<Hero> {
    //construimos nuestra peticion por id
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(url)
      .pipe
      (
        tap(()=> this.log(`fetched hero id=${id} for http`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  //funcion para updatear los heroes
  updateHero(hero: Hero):Observable<any>{

    //creamos la peticion put para actualizar un registro, pasamos url , el objeto y el header
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .pipe
      (
        tap(()=> this.log(`update hero id=${hero.id} for http`)),
        catchError(this.handleError<any>(`updateHero id=${hero.id}`))
      );
  }

  //funcion para añadir heroes, en este caso si que devolvemos el objeto creado
  addHero(hero: Hero): Observable<Hero>{

    //utilizamos el metodo post
    return this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe
      (//en el tap recuperamos el objeto creado
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  //FUNCION PARA ELIMINAR EL HERO
  deleteHero(hero:Hero | number): Observable<any>{
    //comprobamos de quetipo es el parámetro
    const id = typeof hero === 'number' ? hero : hero.id;
    //generamos la url para el delete especificando el id
    const url = `${this.heroesUrl}/${id}}`;
    //utilizamos el metodo delete
    return this.http
      .delete(url)
      .pipe
      (
        tap(()=> this.log(`delete hero id=${id} for http`)),
        catchError(this.handleError<any>(`deleteHero id=${id}`, {d: false}))
      );
  }

  //esta funcion recibe el nombre la operacion que debe controlarse , y el resultado si es fallido
  private handleError<T>(operation = 'operation', result? : T){
    return (error: any): Observable<T> => 
    {
      //logueamos el error en la consola
      console.error(error);
      //logueamos el error en nuestro servicio
      this.log(`${operation} failed: ${error}`);
      //devolvemos el resultado
      return of(result as T); 
    }; 
  }

  //Nos creamos una funcion de log para no repetir código
  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }
}
