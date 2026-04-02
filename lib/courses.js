import fs from 'fs';
import path from 'path';

export function getCourse(clientId) {
  const coursePath = path.join(process.cwd(), 'courses', clientId, 'course.json');
  if (!fs.existsSync(coursePath)) return null;
  return JSON.parse(fs.readFileSync(coursePath, 'utf-8'));
}

export function getTheme(clientId) {
  const themePath = path.join(process.cwd(), 'courses', clientId, 'theme.json');
  if (!fs.existsSync(themePath)) return null;
  return JSON.parse(fs.readFileSync(themePath, 'utf-8'));
}

export function getAvailableClients() {
  const coursesDir = path.join(process.cwd(), 'courses');
  if (!fs.existsSync(coursesDir)) return [];
  return fs.readdirSync(coursesDir).filter(d => {
    return fs.existsSync(path.join(coursesDir, d, 'course.json'));
  });
}
