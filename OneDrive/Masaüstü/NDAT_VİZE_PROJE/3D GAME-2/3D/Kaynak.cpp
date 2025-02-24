#include <GL/glut.h>
#include <cmath>

GLfloat angle = 0.0f;
GLfloat scale = 1.0f;
GLfloat translateX = 0.0f;
GLfloat translateY = 0.0f;

void drawSphere() {
    glPushMatrix();
    glTranslatef(translateX, translateY, 0.0f);
    glRotatef(angle, 0.0f, 1.0f, 0.0f);
    glScalef(scale, scale, scale);

    const int stacks = 50;
    const int slices = 50;
    const float radius = 1.0f;

    for (int i = 0; i < stacks; ++i) {
        float theta1 = i * 3.14159f / stacks;
        float theta2 = (i + 1) * 3.14159f / stacks;

        glBegin(GL_QUAD_STRIP);
        for (int j = 0; j <= slices; ++j) {
            float phi = j * 2 * 3.14159f / slices;

            
            glColor3f(cos(phi) * sin(theta1), sin(phi) * sin(theta1), cos(theta1));
            glVertex3f(radius * cos(phi) * sin(theta1), radius * sin(phi) * sin(theta1), radius * cos(theta1));

            glColor3f(cos(phi) * sin(theta2), sin(phi) * sin(theta2), cos(theta2));
            glVertex3f(radius * cos(phi) * sin(theta2), radius * sin(phi) * sin(theta2), radius * cos(theta2));
        }
        glEnd();
    }

    glPopMatrix();
}

void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0.0f, 0.0f, 5.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f);

    glPushMatrix();
    glTranslatef(0.0f, 0.0f, 0.0f);
    drawSphere();
    glPopMatrix();

    glutSwapBuffers();
}

void reshape(int width, int height) {
    glViewport(0, 0, width, height);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0f, static_cast<float>(width) / height, 0.1f, 100.0f);
    glMatrixMode(GL_MODELVIEW);
}

void keyboard(unsigned char key, int x, int y) {
    if (key == 'a') {  //A tuþu saða döndürür
        angle += 5.0f;
    }
    else if (key == 'd') {  //D tuþu sola döndürür
        angle -= 5.0f;
    }
    else if (key == '+') {  //Yukarý hareket ettirir
        scale += 0.1f;
    }
    else if (key == '-') {  //Aþaðý hareket ettirir
        scale -= 0.1f;
    }

    glutPostRedisplay();
}

void specialKeys(int key, int x, int y) {
    switch (key) {
    case GLUT_KEY_LEFT:
        translateX -= 0.1f;
        break;
    case GLUT_KEY_RIGHT:
        translateX += 0.1f;
        break;
    case GLUT_KEY_UP:
        translateY += 0.1f;
        break;
    case GLUT_KEY_DOWN:
        translateY -= 0.1f;
        break;
    }

    glutPostRedisplay();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(800, 600);
    glutCreateWindow(" 3D küre uygulamasý ");

    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutKeyboardFunc(keyboard);
    glutSpecialFunc(specialKeys);

    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glEnable(GL_DEPTH_TEST);

    glutMainLoop();

    return 0;
}
