const distanceLengthMap = new Map();
distanceLengthMap.set(0, 2);
distanceLengthMap.set(1, 2);
distanceLengthMap.set(2, 2);
distanceLengthMap.set(3, 1);
distanceLengthMap.set(4, 1);
distanceLengthMap.set(5, 1);
distanceLengthMap.set(6, 1);
distanceLengthMap.set(7, 2);
distanceLengthMap.set(8, 2);
distanceLengthMap.set(9, 3);
distanceLengthMap.set(10, 3);
distanceLengthMap.set(11, 4);
distanceLengthMap.set(12, 5);
distanceLengthMap.set(13, 6);
distanceLengthMap.set(14, 8);
distanceLengthMap.set(15, 9);
distanceLengthMap.set(16, 10);
distanceLengthMap.set(17, 12);
distanceLengthMap.set(18, 13);
distanceLengthMap.set(19, 15);
distanceLengthMap.set(20, 17);
distanceLengthMap.set(21, 18);
distanceLengthMap.set(22, 20);
distanceLengthMap.set(23, 22);
distanceLengthMap.set(24, 24);
distanceLengthMap.set(25, 26);
distanceLengthMap.set(26, 29);
distanceLengthMap.set(27, 31);
distanceLengthMap.set(28, 33);
distanceLengthMap.set(29, 36);
distanceLengthMap.set(30, 38);
distanceLengthMap.set(31, 41);
distanceLengthMap.set(32, 44);
distanceLengthMap.set(33, 47);
distanceLengthMap.set(34, 50);
distanceLengthMap.set(35, 53);
distanceLengthMap.set(36, 56);
distanceLengthMap.set(37, 59);
distanceLengthMap.set(38, 62);
distanceLengthMap.set(39, 66);
distanceLengthMap.set(40, 69);
distanceLengthMap.set(41, 73);
distanceLengthMap.set(42, 76);
distanceLengthMap.set(43, 80);
distanceLengthMap.set(44, 84);
distanceLengthMap.set(45, 88);
distanceLengthMap.set(46, 92);
distanceLengthMap.set(47, 96);
distanceLengthMap.set(48, 100);
distanceLengthMap.set(49, 104);
distanceLengthMap.set(50, 109);
distanceLengthMap.set(51, 113);
distanceLengthMap.set(52, 118);
distanceLengthMap.set(53, 122);
distanceLengthMap.set(54, 127);
distanceLengthMap.set(55, 132);
distanceLengthMap.set(56, 137);
distanceLengthMap.set(57, 142);
distanceLengthMap.set(58, 147);
distanceLengthMap.set(59, 152);
distanceLengthMap.set(60, 157);
distanceLengthMap.set(61, 162);
distanceLengthMap.set(62, 168);
distanceLengthMap.set(63, 173);
distanceLengthMap.set(64, 178);
distanceLengthMap.set(65, 184);
distanceLengthMap.set(66, 190);
distanceLengthMap.set(67, 196);
distanceLengthMap.set(68, 202);
distanceLengthMap.set(69, 208);
distanceLengthMap.set(70, 214);
distanceLengthMap.set(71, 220);
distanceLengthMap.set(72, 226);
distanceLengthMap.set(73, 232);
distanceLengthMap.set(74, 239);
distanceLengthMap.set(75, 246);
distanceLengthMap.set(76, 252);
distanceLengthMap.set(77, 259);
distanceLengthMap.set(78, 266);
distanceLengthMap.set(79, 273);
distanceLengthMap.set(80, 280);
distanceLengthMap.set(81, 287);
distanceLengthMap.set(82, 294);
distanceLengthMap.set(83, 301);
distanceLengthMap.set(84, 308);
distanceLengthMap.set(85, 315);
distanceLengthMap.set(86, 323);
distanceLengthMap.set(87, 331);
distanceLengthMap.set(88, 339);
distanceLengthMap.set(89, 346);
distanceLengthMap.set(90, 354);
distanceLengthMap.set(91, 362);
distanceLengthMap.set(92, 370);
distanceLengthMap.set(93, 378);
distanceLengthMap.set(94, 386);
distanceLengthMap.set(95, 394);
distanceLengthMap.set(96, 403);
distanceLengthMap.set(97, 411);
distanceLengthMap.set(98, 420);
distanceLengthMap.set(99, 429);
distanceLengthMap.set(100, 438);

module.exports = {
  getLength: function (distance) {
    if (distance) {
      const intDistance = Math.round(distance);
      if (distanceLengthMap.has(intDistance)) {
        return distanceLengthMap.get(intDistance);
      }
    }
    return 0;
  },
};
