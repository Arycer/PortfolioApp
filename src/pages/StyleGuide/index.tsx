import {useState} from 'react';
import {
    Input,
    Textarea,
    Button,
    SearchInput,
    Alert,
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    Badge
} from '../../components/ui/StyledComponents';

const StyleGuide = () => {
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadingClick = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-8">
                Guía de Estilos - Componentes UI
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Input Components */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-white">Componentes de Entrada</h2>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h3 className="text-xl text-slate-300 mb-4">Input</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Input estándar"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe algo..."
                                />

                                <Input
                                    label="Input con error"
                                    error="Este campo es requerido"
                                    placeholder="Escribe algo..."
                                />

                                <Input
                                    label="Input deshabilitado"
                                    disabled
                                    placeholder="No puedes editar esto"
                                    value="Valor deshabilitado"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl text-slate-300 mb-4">Textarea</h3>
                            <Textarea
                                label="Textarea"
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                                placeholder="Escribe un mensaje largo..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <h3 className="text-xl text-slate-300 mb-4">SearchInput</h3>
                            <SearchInput
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Buscar..."
                                onClear={() => setSearchValue('')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Button Components */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-white">Botones</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl text-slate-300 mb-4">Variantes</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="primary">Primary</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl text-slate-300 mb-4">Tamaños</h3>
                                <div className="flex flex-col space-y-4">
                                    <Button size="sm">Small</Button>
                                    <Button size="md">Medium</Button>
                                    <Button size="lg">Large</Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl text-slate-300 mb-4">Estados</h3>
                                <div className="flex flex-col space-y-4">
                                    <Button isLoading={isLoading} onClick={handleLoadingClick}>
                                        {isLoading ? 'Cargando...' : 'Click para cargar'}
                                    </Button>
                                    <Button disabled>Deshabilitado</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alert Components */}
            <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Alertas</h2>
            <div className="space-y-4 mb-10">
                <Alert variant="success">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Este es un mensaje de éxito.
                    </div>
                </Alert>

                <Alert variant="error">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Este es un mensaje de error.
                    </div>
                </Alert>

                <Alert variant="warning">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Este es un mensaje de advertencia.
                    </div>
                </Alert>

                <Alert variant="info">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Este es un mensaje informativo.
                    </div>
                </Alert>
            </div>

            {/* Badge Components */}
            <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Badges</h2>
            <div className="flex flex-wrap gap-4 mb-10">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
            </div>

            {/* Card Components */}
            <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card>
                    <CardHeader>
                        <h3 className="text-white font-medium">Card Header</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300">Este es el contenido principal de la tarjeta.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-white font-medium">Card con Footer</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300">Contenido con footer.</p>
                    </CardContent>
                    <CardFooter>
                        <Button size="sm" variant="primary">Acción</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent>
                        <p className="text-slate-300">Card sin header ni footer.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StyleGuide; 