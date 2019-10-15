import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(updateHeroesList => this.heroes = updateHeroesList);
  }

  add(name: string): void{
    // eliminamos los espacios
    name = name.trim();
    //si es nulo el valor no lo añadimos
    if(!name) return;
    //casteamos el nombre para que genere un objeto Hero
    //añadimos el Hero a la lista
    this.heroService.addHero({name} as Hero)
      .subscribe(newHero => this.heroes.push(newHero));
  }

  delete(hero): void{
    //probocamos un error con el heroe con id 14

    if(hero.id === 14) { hero = 50 }

    this.heroService.deleteHero(hero)
      .subscribe(response => {
        if(response.d === false){
          console.log('error delete');
        }
        else{
          console.log('delete ok');
          this.heroes = this.heroes.filter(h => h !== hero);
        }
      });
  }
}
