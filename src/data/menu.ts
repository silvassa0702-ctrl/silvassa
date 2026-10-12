import type { MenuItem, Size } from '../types';

export const MENU: MenuItem[] = [
  {
    id: 1, name: 'Roasted Nut Fudge Brownie', desc: 'Fudgy brownie with roasted nuts',
    price: 640, rating: 5.0, cat: 'brownie', img: 'img/cheesecake-brownie.jpg', time: '5 hrs', topSelling: true,
  },
  {
    id: 2, name: 'Double Choc Chunk Brownie', desc: 'Rich brownie, chocolate shavings',
    price: 640, rating: 5.0, cat: 'brownie', img: 'img/choc-chunk-brownie.jpg', time: '5 hrs',
  },
  {
    id: 3, name: 'Classic Vanilla Tea Cake', desc: 'Moist vanilla tea cake',
    price: 560, rating: 4.8, cat: 'teacake', img: 'img/chocolate-loaf-cake.jpg', time: '5 hrs', topSelling: true,
  },
  {
    id: 4, name: 'Date & Walnut Loaf', desc: 'Honey sponge, sticky dates',
    price: 560, rating: 4.9, cat: 'teacake', img: 'img/date-walnut-loaf.jpg', time: '1 d',
  },
  {
    id: 5, name: 'Vanilla Butter Loaf', desc: 'Golden butter cake, lightly sweet',
    price: 480, rating: 4.8, cat: 'teacake', img: 'img/vanilla-loaf-cake.jpg', time: '1 d',
  },
  {
    id: 6, name: 'Classic Black Forest Ice Cake', desc: 'Choc sponge, cream, cherries',
    price: 2560, rating: 5.0, cat: 'icecake', img: 'img/cherry-vanilla-cake.jpg', time: '1 d', topSelling: true,
  },
  {
    id: 7, name: 'Black Forest Cake', desc: 'Choc sponge, cream, cherries',
    price: 2720, rating: 5.0, cat: 'icecake', img: 'img/black-forest-cake.jpg', time: '5 hrs',
  },
  {
    id: 8, name: 'Red Velvet Cherry Cake', desc: 'Ruby layers, cream cheese frosting',
    price: 2720, rating: 4.9, cat: 'icecake', img: 'img/red-velvet-cherry-cake.jpg', time: '1 d',
  },
  {
    id: 9, name: 'Blueberry White Cake', desc: 'Vanilla layers, berry compote',
    price: 2560, rating: 4.8, cat: 'icecake', img: 'img/blueberry-white-cake.jpg', time: '1 d',
  },
  {
    id: 10, name: 'Black Forest Gateau', desc: 'Dark sponge, cherries, choc curls',
    price: 2720, rating: 5.0, cat: 'icecake', img: 'img/chocolate-cherry-gateau.jpg', time: '5 hrs',
  },
  {
    id: 11, name: 'Classic Butter Cookies', desc: 'Crisp and buttery, perfect with tea',
    price: 320, rating: 4.9, cat: 'cookies', img: 'img/hero-banner.png', time: '1 d', topSelling: true,
  },
];

export const SIZES: Size[] = [
  { id: 'half', name: 'Half Kg', factor: 0.55 },
  { id: 'full', name: '1 Kg', factor: 1.0 },
];
