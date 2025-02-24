#include <GL/glut.h>
#include <cstdlib>
#include <memory>
#include <vector>

//Oyunun amacý daireyi düþman dairelere çarpmadan karþýya geçirebilmek.Her baþarýlý geçiþte düþman daireler hýzlanýr.
// Toplamda 5 can var.Canlar bitince oyun kapanýr.
//W tuþu ile yukarý,S tuþu ile aþaðý,A tuþu ile sola ,D tuþu ile saða hareket eder.

using namespace std;


static void Timer(int value)
{
	glutPostRedisplay();

	glutTimerFunc(1, Timer, value);
}

class Shape
{
public:
	float x;
	float y;
	float radius;
	float speed;

	Shape(float xIn, float yIn, float rIn, float sIn)
	{
		x = xIn;
		y = yIn;
		radius = rIn;
		speed = sIn;
	}

	virtual void draw() = 0;
	virtual void move() {}
};

class Player : public Shape
{
public:
	int score;
	int life;
	int array[6];
	int level;

	Player(float xIn, float yIn, float rIn, float sIn) : Shape(xIn, yIn, rIn, sIn)
	{
		level = 0;
		score = 0;
		life = 5;
		for (int i = 0; i < 6; i++)
		{
			array[i] = 0;
		}
	}

	void draw()
	{
		glColor3f(1.0, 0.25, 1.0);
		glBegin(GL_TRIANGLE_FAN);
		glVertex2f(x, y);
		for (int i = 0; i <= 360; i += 10)
		{
			float angle = i * 3.14159 / 180;
			float xPos = x + (radius * cos(angle));
			float yPos = y + (radius * sin(angle));
			glVertex2f(xPos, yPos);
		}
		glEnd();
		glFlush();
	}

	float moveIn(float coordinate, float speedIn)
	{
		return coordinate + speedIn;
	}

	void move()
	{
		for (int i = 0; i < 4; i++)
		{
			if (array[i] == 1)
			{
				array[i] = 0;

				if (i == 0)
				{
					x = moveIn(x, -speed);
				}

				if (i == 1)
				{
					x = moveIn(x, +speed);
				}

				if (i == 2)
				{
					y = moveIn(y, -speed);
				}

				if (i == 3)
				{
					y = moveIn(y, +speed);
				}
				if (x - radius <= 0)
				{
					x = radius;
				}
				if (y - radius <= 0)
				{
					y = radius;
				}
				if (x + radius >= 480)
				{
					x = 480 - radius;
				}
				if (y + radius >= 640)
				{
					x = 215;
					y = 95;
					score++;
					level = 1;
				}
			}
		}
	}

	void collision(float xIn, float wIn, float yIn, float hIn)
	{
		if ((xIn >= x - radius && xIn <= x + radius) || (xIn + wIn >= x - radius && xIn + wIn <= x + radius))
		{
			if ((yIn >= y - radius && yIn <= y + radius) || (yIn + hIn >= y - radius && yIn + hIn <= y + radius))
			{
				life--;
				x = 215;
				y = 95;
				if (life <= 0)
				{
					exit(0);
				}
			}
		}
	}
};

class Enemy : public Shape
{
public:
	float fanLength;
	float fanSpeed;
	float fanX;
	float fanY;
	float rColor;
	float gColor;
	float bColor;

	Enemy(float xIn, float yIn, float rIn, float sIn, float rColorIn, float gColorIn, float bColorIn) : Shape(xIn, yIn, rIn, sIn)
	{
		fanLength = 48;
		fanSpeed = 2;
		fanX = xIn;
		fanY = yIn + radius + 2;
		rColor = rColorIn;
		gColor = gColorIn;
		bColor = bColorIn;
	}

	void levelUp()
	{
		speed *= 1.5;
	}

	void move()
	{
		if (speed <= 0)
		{
			if (x - radius >= 0)
			{
				x += speed;
			}
			else {
				speed *= -1;
			}
		}
		else {
			if (x + radius <= 480)
			{
				x += speed;
			}
			else {
				speed *= -1;
			}
		}
		fanX = x;
	}

	void draw()
	{
		glColor3f(rColor, gColor, bColor);
		glBegin(GL_TRIANGLE_FAN);
		glVertex2f(x, y);
		for (int i = 0; i <= 360; i += 10)
		{
			float angle = i * 3.14159 / 180;
			float xPos = x + (radius * cos(angle));
			float yPos = y + (radius * sin(angle));
			glVertex2f(xPos, yPos);
		}
		glEnd();
		glFlush();

		fanLength += fanSpeed;
		if (fanLength >= 50)
		{
			fanSpeed *= -1;
			fanLength = 48;
		}
		if (fanLength <= 0)
		{
			fanSpeed *= -1;
			fanLength = 2;
		}

	
	}
};

shared_ptr<Player> myShape;
vector<shared_ptr<Enemy>> arr;

void keyboard(unsigned char key, int x, int y)
{
	if (key == 97)
	{
		myShape->array[0] = 1;
	}
	if (key == 100)
	{
		myShape->array[1] = 1;
	}
	if (key == 115)
	{
		myShape->array[2] = 1;
	}
	if (key == 119)
	{
		myShape->array[3] = 1;
	}

	glutPostRedisplay();
}


void render()
{
	glClear(GL_COLOR_BUFFER_BIT);

	glColor3f(0.30, 0.55, 1.0);
	glBegin(GL_POLYGON);
	glVertex3f(0, 0, 0.0);
	glVertex3f(480, 0, 0.0);
	glVertex3f(480, 240, 0.0);
	glVertex3f(0, 240, 0.0);
	
	glEnd();
	glFlush();

	myShape->move();

	if (myShape->level == 1)
	{
		myShape->level = 0;
		for (int i = 0; i < arr.size(); i++)
		{
			arr[i]->levelUp();
		}
	}

	for (int i = 0; i < arr.size(); i++)
	{
		arr[i]->move();
		arr[i]->draw();
		myShape->collision(arr[i]->x, arr[i]->radius, arr[i]->y, arr[i]->speed);
	}

	myShape->draw();

	glColor3f(0, 0, 0);
	glRasterPos2f(250, 630);
	char puantext[4] = { 'P','u','a','n' };
	for (int i = 0; i < 4; i++)
	{
		glutBitmapCharacter(GLUT_BITMAP_8_BY_13, puantext[i]);
	}

	char puan = myShape->score + '0';
	glColor3f(1, 0, 0);
	glRasterPos2f(300, 630);
	glutBitmapCharacter(GLUT_BITMAP_8_BY_13, puan);

	glColor3f(0, 0, 0);
	glRasterPos2f(350, 630);
	char lifetext[3] = { 'C','a','n' };
	for (int i = 0; i < 3; i++)
	{
		glutBitmapCharacter(GLUT_BITMAP_8_BY_13, lifetext[i]);
	}

	char life = myShape->life + '0';
	glColor3f(1, 0, 0);
	glRasterPos2f(400, 630);
	glutBitmapCharacter(GLUT_BITMAP_8_BY_13, life);

	glutSwapBuffers();
}


void myInit()
{
	glClearColor(0, 1.0, 1.0, 0.0);

	glColor3f(1.0f, 0.0f, 0.0f);

	glMatrixMode(GL_PROJECTION);

	glOrtho(0.0, 480.0, 0.0, 640.0, -1.0, 1.0);
}


int main(int argc, char** argv)
{
	myShape = make_shared<Player>(215, 95, 25, 10);
	arr.push_back(make_shared<Enemy>(0, 250, 25, 0.2, 0, 0, 0));
	arr.push_back(make_shared<Enemy>(430, 320, 25, 0.3, 1, 1, 0));
	arr.push_back(make_shared<Enemy>(430, 400, 25, 0.4, 0, 1, 0));
	arr.push_back(make_shared<Enemy>(0, 470, 25, 0.5, 1, 0, 0));

	glutInit(&argc, argv);

	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA);

	glutInitWindowSize(480,640);

	glutInitWindowPosition(0, 0);

	glutCreateWindow("Circle Game");


	
	myInit();

	glutKeyboardFunc(keyboard);

	glutDisplayFunc(render);

	Timer(0);

	glutMainLoop();

	return 0;
}