var modes = require('./modes');
var types = Object.keys(modes);
var fixtures = require('./test/fixtures.json');
var crypto = require('crypto');

var ebtk = require('./EVP_BytesToKey');
var fs = require('fs');
var fixture = {
  text: 'Chapter 24\n\nMy present situation was one in which all voluntary thought was\nswallowed up and lost.  I was hurried away by fury; revenge alone\nendowed me with strength and composure; it moulded my feelings and\nallowed me to be calculating and calm at periods when otherwise\ndelirium or death would have been my portion.\n\nMy first resolution was to quit Geneva forever; my country, which, when\nI was happy and beloved, was dear to me, now, in my adversity, became\nhateful.  I provided myself with a sum of money, together with a few\njewels which had belonged to my mother, and departed.  And now my\nwanderings began which are to cease but with life.  I have traversed a\nvast portion of the earth and have endured all the hardships which\ntravellers in deserts and barbarous countries are wont to meet.  How I\nhave lived I hardly know; many times have I stretched my failing limbs\nupon the sandy plain and prayed for death.  But revenge kept me alive;\nI dared not die and leave my adversary in being.\n\nWhen I quitted Geneva my first labour was to gain some clue by which I\nmight trace the steps of my fiendish enemy.  But my plan was unsettled,\nand I wandered many hours round the confines of the town, uncertain\nwhat path I should pursue.  As night approached I found myself at the\nentrance of the cemetery where William, Elizabeth, and my father\nreposed.  I entered it and approached the tomb which marked their\ngraves.  Everything was silent except the leaves of the trees, which\nwere gently agitated by the wind; the night was nearly dark, and the\nscene would have been solemn and affecting even to an uninterested\nobserver.  The spirits of the departed seemed to flit around and to\ncast a shadow, which was felt but not seen, around the head of the\nmourner.\n\nThe deep grief which this scene had at first excited quickly gave way\nto rage and despair.  They were dead, and I lived; their murderer also\nlived, and to destroy him I must drag out my weary existence.  I knelt\non the grass and kissed the earth and with quivering lips exclaimed,\n"By the sacred earth on which I kneel, by the shades that wander near\nme, by the deep and eternal grief that I feel, I swear; and by thee, O\nNight, and the spirits that preside over thee, to pursue the daemon who\ncaused this misery, until he or I shall perish in mortal conflict.  For\nthis purpose I will preserve my life; to execute this dear revenge will\nI again behold the sun and tread the green herbage of earth, which\notherwise should vanish from my eyes forever.  And I call on you,\nspirits of the dead, and on you, wandering ministers of vengeance, to\naid and conduct me in my work.  Let the cursed and hellish monster\ndrink deep of agony; let him feel the despair that now torments me."  I\nhad begun my adjuration with solemnity and an awe which almost assured\nme that the shades of my murdered friends heard and approved my\ndevotion, but the furies possessed me as I concluded, and rage choked\nmy utterance.',
  password: 'correcthorsebatterystaple',
  iv: 'fffffffffffffffffffffffffffffffa',
  results:{
    ciphers: {},
    cipherivs: {}
  }
};
fixtures.push(fixture);
types.forEach(function (cipher) {
    var suite = crypto.createCipher(cipher, new Buffer(fixture.password));
    var buf = new Buffer('');
    buf = Buffer.concat([buf, suite.update(new Buffer(fixture.text))]);
    buf = Buffer.concat([buf, suite.final()]);
    fixture.results.ciphers[cipher] = buf.toString('hex');
    if (modes[cipher].mode === 'ECB') {
      return;
    }
    var suite2 = crypto.createCipheriv(cipher, ebtk(crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
    var buf2 = new Buffer('');
    buf2 = Buffer.concat([buf2, suite2.update(new Buffer(fixture.text))]);
    buf2 = Buffer.concat([buf2, suite2.final()]);
    fixture.results.cipherivs[cipher] = buf2.toString('hex');
  });

fs.writeFileSync('./test/fixturesNew.json', JSON.stringify(fixtures, false, 4));